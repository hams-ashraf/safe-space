import * as signalR from "@microsoft/signalr";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Meeting.css";
import { isDoctorUser, getStoredUser } from "../../api/roleApi";
import { endCall, updateNotes } from "../../api/sessionsApi";

export default function Meeting() {
  const [selectedVoice, setSelectedVoice] = useState("Normal");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [connection, setConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [micError, setMicError] = useState("");
  const [micReady, setMicReady] = useState(false);
  const [forceEndCall, setForceEndCall] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notesContent, setNotesContent] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const localStreamRef = useRef(null);
  const rawMicStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const destRef = useRef(null);
  const filterRef = useRef(null);
  const compressorRef = useRef(null);
  const distortionRef = useRef(null);
  const tremoloOscRef = useRef(null);
  const tremoloGainRef = useRef(null);
  const session = location.state?.session;
  const callData = location.state?.callData;

  const voiceOptions = [
    { label: "Normal", icon: "fa-solid fa-wave-square" },
    { label: "Soft Voice", icon: "fa-solid fa-feather-pointed" },
    { label: "Deep Voice", icon: "fa-solid fa-sliders" },
    { label: "Robotic Voice", icon: "fa-solid fa-robot" },
  ];

  const isDoctor = isDoctorUser();
  const isGroup = session?.sessionType !== "OneToOne";
  const doctorId = session?.doctorId || session?.DoctorId;
  const currentUser = getStoredUser();
  const myName = currentUser?.fullName || "You";
  const otherPersonName = isDoctor ? (session?.patientName || "Patient") : (session?.doctorName || "Dr. Sarah");

  const getAvatarUrl = (gender) => {
    const isFemale = typeof gender === "string" && gender.trim().toLowerCase() === "female";
    return isFemale 
      ? "https://cdn-icons-png.flaticon.com/512/4140/4140047.png" // Girl
      : "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"; // Boy
  };

  let myGenderStr = null;
  let otherGenderStr = null;

  if (isDoctor) {
    // Doctor Interface 
    myGenderStr = session?.doctorGender || session?.DoctorGender; // Doctor's own gender
    otherGenderStr = session?.gender || session?.Gender;         // Patient's gender in this API
  } else {
    // Patient Interface (using Sessions API)
    myGenderStr = session?.patientGender || session?.PatientGender; // Patient's own gender
    otherGenderStr = session?.doctorGender || session?.DoctorGender; // Doctor's gender in this API
  }

  const myAvatarUrl = getAvatarUrl(myGenderStr);
  const otherAvatarUrl = getAvatarUrl(otherGenderStr);
  const callStatus = callData?.status || "Started";
  const roomId = callData?.roomId;
  const [hubError, setHubError] = useState("");
  const timerLabel = `${String(Math.floor(elapsedSeconds / 60)).padStart(
    2,
    "0"
  )}:${String(elapsedSeconds % 60).padStart(2, "0")}`;
  
  const isDoctorJoined = participants.some(p => String(p.userId) === String(doctorId));
  const otherParticipants = participants.filter(p => String(p.userId) !== String(doctorId));
  const otherHasJoined = participants.length > 0;

  useEffect(() => {
    const timerId = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);


  const handleSaveNotes = async () => {
    if (!session?.sessionId) return;
    setIsSavingNotes(true);
    setSaveSuccess(false);
    try {
      await updateNotes(session.sessionId, notesContent);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3s
    } catch (err) {
      console.error("Failed to save notes", err);
      alert("Failed to save notes. Please try again.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  useEffect(() => {
    const setupMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        rawMicStreamRef.current = stream;

        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextCtor();
        audioCtxRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        sourceRef.current = source;

        const dest = ctx.createMediaStreamDestination();
        destRef.current = dest;

        // For Doctor: Just pass the raw audio without heavy Voice Changer nodes
        if (isDoctor) {
          source.connect(dest);
          localStreamRef.current = dest.stream;
          setMicError("");
          setMicReady(true);
          return;
        }

        // For Patient: Initialize Voice Changer nodes
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 20000;
        filter.Q.value = 0.7;
        filterRef.current = filter;

        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -22;
        compressor.knee.value = 24;
        compressor.ratio.value = 6;
        compressor.attack.value = 0.01;
        compressor.release.value = 0.2;
        compressorRef.current = compressor;

        const distortion = ctx.createWaveShaper();
        distortion.oversample = "4x";
        distortion.curve = new Float32Array([0, 0]); 
        distortionRef.current = distortion;

        const tremoloGain = ctx.createGain();
        tremoloGain.gain.value = 1;
        tremoloGainRef.current = tremoloGain;

        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.value = 30; 
        tremoloOscRef.current = osc;
        osc.connect(tremoloGain.gain);
        osc.start();

        // Default graph = Normal
        source.connect(dest);
        localStreamRef.current = dest.stream;
        setMicError("");
        setMicReady(true);
      } catch (err) {
        console.error("Microphone access failed:", err);
        setMicError("Microphone permission denied.");
      }
    };

    setupMicrophone();

    return () => {
      try {
        if (tremoloOscRef.current) tremoloOscRef.current.stop();
      } catch {
        // no-op
      }

      if (rawMicStreamRef.current) {
        rawMicStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, []);

  const setDistortionAmount = (amount) => {
    const distortion = distortionRef.current;
    if (!distortion) return;

    if (!amount) {
      distortion.curve = null;
      return;
    }

    const k = typeof amount === "number" ? amount : 20;
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    distortion.curve = curve;
  };

  const applyVoiceOption = (option) => {
    const ctx = audioCtxRef.current;
    const source = sourceRef.current;
    const dest = destRef.current;
    const filter = filterRef.current;
    const compressor = compressorRef.current;
    const distortion = distortionRef.current;
    const tremoloGain = tremoloGainRef.current;

    if (!ctx || !source || !dest || !filter || !compressor || !distortion || !tremoloGain) return;

    // ensure running 
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Clear old graph
    try {
      source.disconnect();
      filter.disconnect();
      compressor.disconnect();
      distortion.disconnect();
      tremoloGain.disconnect();
    } catch {
      // no-op
    }

    // Defaults
    filter.type = "lowpass";
    filter.frequency.value = 20000;
    filter.Q.value = 0.7;
    filter.gain.value = 0; // Reset gain for shelf filters
    compressor.threshold.value = -22;
    compressor.ratio.value = 6;
    tremoloGain.gain.value = 1;
    setDistortionAmount(0);
    if (tremoloOscRef.current) tremoloOscRef.current.frequency.value = 30;

    if (option === "Soft Voice") {
      // Thin, airy, whispering sound
      filter.type = "highpass";
      filter.frequency.value = 800; // Cut off all bass/mids below 800Hz
      filter.Q.value = 1.0;
      
      compressor.threshold.value = -35;
      compressor.ratio.value = 12; // Heavy compression to pick up whispers
      
      source.connect(filter);
      filter.connect(compressor);
      compressor.connect(dest);
      return;
    }

    if (option === "Deep Voice") {
      // Massive bass boost
      filter.type = "lowshelf";
      filter.frequency.value = 350; // Boost everything below 350Hz
      filter.gain.value = 25; // +25dB bass boost! (extremely noticeable)
      
      source.connect(filter);
      filter.connect(dest);
      return;
    }

    if (option === "Robotic Voice") {
      // Walkie-talkie EQ + heavy distortion + fast AM modulation
      filter.type = "bandpass";
      filter.frequency.value = 1500;
      filter.Q.value = 1.5;
      
      setDistortionAmount(80); // Very high distortion
      tremoloGain.gain.value = 1; // 100% AM depth
      if (tremoloOscRef.current) tremoloOscRef.current.frequency.value = 50; // 50Hz Dalek modulation
      
      source.connect(filter);
      filter.connect(distortion);
      distortion.connect(tremoloGain);
      tremoloGain.connect(dest);
      return;
    }

    // Normal
    source.connect(dest);
  };

  useEffect(() => {
    applyVoiceOption(selectedVoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoice]);

  useEffect(() => {
    if (!roomId) {
      setConnectionStatus("No room id found");
      return undefined;
    }

    if (!micReady) {
      setConnectionStatus("Waiting for microphone...");
      return undefined;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setConnectionStatus("Missing auth token");
      return undefined;
    }

    const hubCandidates = [
      "https://doctorprofile.runasp.net/callHub",
      "http://doctorprofile.runasp.net/callHub",
      "https://doctorprofile.runasp.net/api/callHub",
      "http://doctorprofile.runasp.net/api/callHub",
      "/callHub"
    ];

    let activeConnection = null;

    const setupPeerConnection = (hubConn, targetConnId) => {
      if (peerConnectionRef.current) return peerConnectionRef.current;

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          try {
            await hubConn.invoke(
              "SendIceCandidate",
              targetConnId,
              JSON.stringify(event.candidate),
              event.candidate.sdpMid,
              event.candidate.sdpMLineIndex
            );
          } catch (e) {
            console.error("Failed to send ICE candidate", e);
          }
        }
      };

      pc.ontrack = (event) => {
        if (remoteAudioRef.current && event.streams[0]) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current = pc;
      return pc;
    };

    const attachListeners = (hubConnection) => {
      hubConnection.on("ParticipantJoined", async (payload) => {
        const joinedUserId = payload?.userId;
        const joinedConnId = payload?.connectionId;
        const myUserId = currentUser?.id;
        
        // Use user ID to ignore our own connection
        if (joinedUserId && myUserId && String(joinedUserId) === String(myUserId)) {
          return; // Ignore ourselves
        }
        
        setParticipants((prev) => {
          const exists = prev.some((p) => String(p.userId) === String(joinedUserId));
          if (exists) return prev;
          return [...prev, { 
            ...payload, 
            name: payload.displayName || payload.userName || payload.fullName || `Member ${prev.length + 1}`,
            gender: payload.gender || "male"
          }];
        });

        // We are the existing participant, send an offer to the new participant
        if (joinedConnId) {
          try {
            const pc = setupPeerConnection(hubConnection, joinedConnId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            await hubConnection.invoke("SendOffer", roomId, joinedConnId, JSON.stringify(offer));
          } catch (err) {
            console.error("Error sending offer to new participant", err);
          }
        }
      });

      hubConnection.on("ReceiveOffer", async (payload) => {
        const { fromConnectionId, sdp } = payload;
        
        // Fallback to register the other person if we didn't get ParticipantJoined
        setParticipants((prev) => {
          if (prev.some((p) => p.connectionId === fromConnectionId)) return prev;
          return [...prev, { 
            connectionId: fromConnectionId, 
            userId: payload.userId || "peer",
            name: payload.displayName || payload.userName || "Participant",
            gender: payload.gender || "male"
          }];
        });

        try {
          const pc = setupPeerConnection(hubConnection, fromConnectionId);
          const offer = JSON.parse(sdp);
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await hubConnection.invoke("SendAnswer", fromConnectionId, JSON.stringify(answer));
        } catch (err) {
          console.error("Error receiving offer and sending answer", err);
        }
      });

      hubConnection.on("ReceiveAnswer", async (payload) => {
        const { sdp } = payload;
        try {
          const pc = peerConnectionRef.current;
          if (pc) {
            const answer = JSON.parse(sdp);
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        } catch (err) {
          console.error("Error handling answer", err);
        }
      });

      hubConnection.on("ReceiveIceCandidate", async (payload) => {
        const { candidate } = payload;
        try {
          const pc = peerConnectionRef.current;
          if (pc) {
            const rtcCandidate = new RTCIceCandidate(JSON.parse(candidate));
            await pc.addIceCandidate(rtcCandidate);
          }
        } catch (err) {
          console.error("Error adding ICE candidate", err);
        }
      });

      hubConnection.on("ParticipantLeft", (payload) => {
        const leftUserId = payload?.userId;
        
        setParticipants((prev) =>
          prev.filter((p) => String(p.userId) !== String(leftUserId))
        );
        
        // Only force end the call for everyone if the DOCTOR leaves 
        // OR if it's a 1-on-1 session and the other person leaves.
        const isLeftUserDoctor = String(leftUserId) === String(doctorId);
        
        if (!isGroup || isLeftUserDoctor) {
          setForceEndCall(true);
        }
      });

      // Just in case the backend broadcasts an explicit CallEnded event
      hubConnection.on("CallEnded", () => {
        setForceEndCall(true);
      });

      hubConnection.onreconnecting(() => setConnectionStatus("Reconnecting..."));
      hubConnection.onreconnected(() => setConnectionStatus("Connected"));
      hubConnection.onclose(() => setConnectionStatus("Disconnected"));
    };

    const startConnection = async () => {
      let lastError = null;

      for (const hubUrl of hubCandidates) {
        const hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: () => localStorage.getItem("token") || "",
          })
          .withAutomaticReconnect()
          .build();

        attachListeners(hubConnection);
        setConnectionStatus(`Connecting (${hubUrl})...`);

        try {
          await hubConnection.start();
          const existing = await hubConnection.invoke("JoinCallRoom", roomId);
          if (Array.isArray(existing)) {
            // The backend returned the existing participants
            setParticipants((prev) => {
              const myId = currentUser?.id;
              const others = existing.map((p, idx) => ({
                ...p,
                connectionId: p.connectionId || `conn-${idx}`,
                userId: p.userId || p,
                name: p.displayName || p.userName || p.fullName || `Member ${idx + 1}`,
                gender: p.gender || "male"
              })).filter((p) => String(p.userId) !== String(myId));
              return [...prev, ...others];
            });
          }
          activeConnection = hubConnection;
          setConnection(hubConnection);
          setHubError("");
          setConnectionStatus("Connected");
          return;
        } catch (err) {
          lastError = err;
          try {
            await hubConnection.stop();
          } catch {
            // no-op
          }
        }
      }

      console.error("SignalR connection failed:", lastError);
      setHubError(lastError?.message || "Unknown hub error");
      setConnectionStatus("Connection failed");
    };

    startConnection();

    return () => {
      const cleanup = async () => {
        try {
          if (
            activeConnection &&
            activeConnection.state === signalR.HubConnectionState.Connected
          ) {
            await activeConnection.invoke("LeaveCallRoom", roomId);
          }
          if (activeConnection) {
            await activeConnection.stop();
          }
        } catch (err) {
          console.error("SignalR cleanup failed:", err);
        }
      };
      cleanup();
    };
  }, [roomId, micReady]);

  useEffect(() => {
    if (forceEndCall) {
      alert("The session has ended because the other participant left.");
      handleLeaveSession();
    }
  }, [forceEndCall]);

  const handleToggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) {
      setMicError("Microphone is not available.");
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (!audioTracks.length) {
      setMicError("No audio track found.");
      return;
    }

    const nextMuted = !isMuted;
    audioTracks.forEach((track) => {
      track.enabled = !nextMuted;
    });
    setMicError("");
    setIsMuted(nextMuted);
  };

  async function handleLeaveSession() {
    try {
      if (isDoctor) {
        // Try different properties where the call ID might be stored
        const callId = callData?.id || callData?.callSessionId || session?.sessionId;
        if (callId) {
          try {
            await endCall(callId);
          } catch (endErr) {
            console.error("End call API failed:", endErr);
          }
          // Locally save that we ended this session so it instantly disappears from the Home page
          const sid = session?.sessionId || session?.sessionsId || session?.id;
          if (sid) {
            const endedSessions = JSON.parse(localStorage.getItem("ended_sessions") || "[]");
            if (!endedSessions.includes(sid)) {
              endedSessions.push(sid);
              localStorage.setItem("ended_sessions", JSON.stringify(endedSessions));
            }
          }
        }
      }

      if (connection && connection.state === signalR.HubConnectionState.Connected) {
        if (roomId) {
          await connection.invoke("LeaveCallRoom", roomId);
        }
        await connection.stop();
      }
    } catch (err) {
      console.error("Leave session failed:", err);
    } finally {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      navigate("/sessions");
    }
  };

  return (
    <div className="meeting-page">
      <div className="meeting-shell">
        <div className="meeting-topbar">
          <div className="meeting-status-pill">
            <span className="meeting-dot" />
            <span>{callStatus}</span>
          </div>
          <div className="meeting-timer">{timerLabel}</div>
        </div>

        <h1 className="meeting-title">You are in a secure anonymous voice session</h1>
        <p className="meeting-subtitle">
          <i className="fa-solid fa-shield-halved" />
          Your conversation is private and encrypted
        </p>

        {/* Hidden audio element to play remote sound */}
        <audio ref={remoteAudioRef} autoPlay hidden />

        <div className={`meeting-avatars ${isGroup ? "group-mode" : ""}`}>
          {/* My Avatar (Always present) */}
          <div className="meeting-person">
            <div className="avatar-ring">
              <img
                src={myAvatarUrl}
                alt="User avatar"
                className="avatar-image"
              />
            </div>
            <h3 className="person-name">You</h3>
            <span className={`person-badge ${isMuted ? "muted" : "speaking"}`}>
              <i
                className={`fa-solid ${
                  isMuted ? "fa-microphone-slash" : "fa-microphone"
                }`}
              />
              {isMuted ? "Muted" : "Speaking now"}
            </span>
          </div>

          {!isGroup && (
            <>
              <div className="voice-wave">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="meeting-person">
                <div className="avatar-ring">
                  <img
                    src={otherAvatarUrl}
                    alt="Other person avatar"
                    className={`avatar-image ${!otherHasJoined ? "opacity-50" : ""}`}
                  />
                </div>
                <h3 className="person-name">{otherPersonName}</h3>
                {otherHasJoined ? (
                  <span className="person-badge listening">
                    <i className="fa-solid fa-headphones-simple" />
                    Listening
                  </span>
                ) : (
                  <span className="person-badge waiting" style={{ color: "#6c757d", border: "1px dashed #ced4da", background: "#f8f9fa", fontWeight: "600", fontSize: "0.9rem" }}>
                    <i className="fa-solid fa-hourglass-half" />
                    Waiting for {otherPersonName.split(' ')[0]}...
                  </span>
                )}
              </div>
            </>
          )}

          {isGroup && (
            <div className="participants-grid">
              {/* Doctor Slot in Group (Joined or Waiting) */}
              {!isDoctor && (
                <div className="meeting-person doctor-slot">
                   <div className={`avatar-ring small ${isDoctorJoined ? "" : "opacity-50"}`}>
                      <img
                        src={otherAvatarUrl}
                        alt="Doctor avatar"
                        className="avatar-image"
                      />
                   </div>
                   <h3 className="person-name small">{otherPersonName}</h3>
                   <span className={`person-badge small ${isDoctorJoined ? "listening" : "waiting"}`}>
                      <i className={`fa-solid ${isDoctorJoined ? "fa-headphones-simple" : "fa-hourglass-half"}`} />
                      {isDoctorJoined ? "Joined" : "Waiting..."}
                   </span>
                </div>
              )}

              {/* Other Members */}
              {otherParticipants.map((p, idx) => (
                <div className="meeting-person participant-item" key={p.connectionId || idx}>
                  <div className="avatar-ring small">
                    <img
                      src={getAvatarUrl(p.gender)}
                      alt="Participant avatar"
                      className="avatar-image"
                    />
                  </div>
                  <h3 className="person-name small">{p.name || `Member ${idx + 1}`}</h3>
                  <span className="person-badge listening small">
                    <i className="fa-solid fa-headphones-simple" />
                    Listening
                  </span>
                </div>
              ))}
              
              {!isDoctor && !isDoctorJoined && otherParticipants.length === 0 && (
                <div className="waiting-placeholder">
                  <p className="text-muted small mt-3">
                    <i className="fa-solid fa-circle-info me-1"></i>
                    Waiting for the session to start...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="meeting-safe-message">
          <i className="fa-solid fa-shield-heart" />
          {roomId
            ? `Room ID: ${roomId}`
            : "This is a safe space. Take your time and speak freely."}
        </div>

        <div className="meeting-realtime-bar">
          <span className="badge text-bg-light">Hub: {connectionStatus}</span>
          <span className="badge text-bg-light">
            Participants: {participants.length + 1}
          </span>
        </div>
        {hubError && <p className="text-danger text-center mb-3">Hub error: {hubError}</p>}
        {micError && <p className="text-danger text-center mb-3">{micError}</p>}

        <div className="meeting-actions">
          <button type="button" className="action-btn" onClick={handleToggleMute}>
            <span className={`action-icon ${isMuted ? "muted" : "success"}`}>
              <i
                className={`fa-solid ${
                  isMuted ? "fa-microphone-slash" : "fa-microphone"
                }`}
              />
            </span>
            <span>{isMuted ? "Unmute" : "Mute"}</span>
          </button>

          {!isDoctor && (
            <div className="dropdown action-dropdown">
              <span className="action-icon mint">
                <i className="fa-solid fa-masks-theater" />
              </span>
              <button
                type="button"
                className="action-btn voice-trigger dropdown-toggle border-0 bg-transparent"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-expanded="false"
              >
                <span>Voice Changer</span>
              </button>
              <ul className="dropdown-menu voice-menu shadow-sm">
                <li className="voice-menu-title">Voice Changer</li>
                {voiceOptions.map((option) => (
                  <li key={option.label}>
                    <button
                      type="button"
                      className={`dropdown-item voice-item ${
                        selectedVoice === option.label ? "active" : ""
                      }`}
                      onClick={() => setSelectedVoice(option.label)}
                    >
                      <span className="voice-item-left">
                        <i className={option.icon} />
                        {option.label}
                      </span>
                      {selectedVoice === option.label && (
                        <i className="fa-solid fa-check voice-check" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isDoctor && (
            <button type="button" className={`action-btn ${showNotes ? "active" : ""}`} onClick={() => setShowNotes(!showNotes)}>
              <span className="action-icon light">
                <i className="fa-regular fa-note-sticky" />
              </span>
              <span>Notes</span>
            </button>
          )}

          <button
            type="button"
            className="action-btn"
            onClick={handleLeaveSession}
          >
            <span className="action-icon danger">
              <i className="fa-solid fa-phone-slash" />
            </span>
            <span className="text-danger">{isDoctor ? "End Call" : "Leave"}</span>
          </button>
        </div>
      </div>

      {/* Notes Slide-out Panel */}
      {isDoctor && (
        <div className={`notes-side-panel ${showNotes ? "open" : ""}`}>
          <div className="notes-panel-header">
            <h3>Session Notes</h3>
            <button className="notes-close-btn" onClick={() => setShowNotes(false)}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className="notes-panel-body">
            <textarea
              className="notes-textarea"
              placeholder="Write your session notes here..."
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
            />
          </div>
          <div className="notes-panel-footer">
            {saveSuccess && (
              <div className="text-success text-center mb-2 fw-bold" style={{ fontSize: "0.9rem" }}>
                <i className="fa-solid fa-circle-check me-1"></i> Notes saved successfully!
              </div>
            )}
            <button
              className="btn btn-success w-100 fw-bold"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
            >
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

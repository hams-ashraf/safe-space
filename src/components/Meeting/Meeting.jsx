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
  const peerConnectionsRef = useRef({});
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
  const isLeavingRef = useRef(false);

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
    if (gender === "neutral") return "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // WhatsApp-like neutral icon
    return isFemale
      ? "https://cdn-icons-png.flaticon.com/512/4140/4140047.png" // Girl
      : "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"; // Boy
  };

  let myGenderStr = null;
  let otherGenderStr = null;

  if (isDoctor) {
    // Doctor Interface 
    myGenderStr = session?.doctorGender || session?.DoctorGender;
    otherGenderStr = session?.gender || session?.Gender;
  } else {
    // Patient Interface 
    myGenderStr = session?.patientGender || session?.PatientGender;
    otherGenderStr = session?.doctorGender || session?.DoctorGender;
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

  const isDoctorJoined = participants.some(p => p.isDoctor || (doctorId && String(p.userId) === String(doctorId)));

  const otherParticipants = participants.filter(p => !p.isDoctor && (!doctorId || String(p.userId) !== String(doctorId)));
  
  const otherHasJoined = participants.length > 0;

  const normalizeParticipant = (p) => {
    const uid = p.userId || p.UserId || p.userid || (typeof p === 'string' || typeof p === 'number' ? p : null);
    const cid = p.connectionId || p.ConnectionId || p.connectionid;
    return {
      ...p,
      userId: uid,
      connectionId: cid
    };
  };

  const identifyParticipant = (normalized, idx) => {
    let pName = normalized.name || normalized.Name || null;
    let pGender = normalized.gender || normalized.Gender || "neutral";

    let isUserDoctor = false;
    
    // Only patients need to identify if the joining user is the doctor
    if (!isDoctor) {
      if (doctorId && String(normalized.userId) === String(doctorId)) isUserDoctor = true;
      if (pName && otherPersonName && String(pName).toLowerCase().includes(String(otherPersonName).toLowerCase())) isUserDoctor = true;
      if (pName && otherPersonName && String(otherPersonName).toLowerCase().includes(String(pName).toLowerCase())) isUserDoctor = true;
      if (normalized.role && String(normalized.role).toLowerCase() === 'doctor') isUserDoctor = true;
      if (normalized.isHost) isUserDoctor = true;
    }

    if (isUserDoctor) {
      pName = otherPersonName;
      pGender = otherGenderStr;
    } else if (isDoctor) {
      const patientData = (session?.patients || session?.Patients)?.find(
        (p) => String(p.id || p.userId || p.UserId || p.PatientId || p.patientId) === String(normalized.userId)
      );
      if (patientData) {
        pName = patientData.name || patientData.Name || pName;
        pGender = patientData.gender || patientData.Gender || pGender;
      }
      if (!pName) pName = "Patient";
    } else {
      pName = null;
      pGender = "neutral";
    }

    return {
      ...normalized,
      name: pName,
      gender: pGender,
      isDoctor: isUserDoctor
    };
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const handleSaveNotes = async () => {
    const sid = session?.sessionId || session?.sessionsId || session?.SessionId || session?.SessionsId || session?.id;
    if (!sid) {
      console.error("No session ID found to save notes");
      return;
    }
    setIsSavingNotes(true);
    setSaveSuccess(false);
    try {
      await updateNotes(sid, notesContent);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
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

        // For Doctor: Just pass the raw audio 
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
        audioCtxRef.current.close().catch(() => { });
      }

      Object.values(peerConnectionsRef.current).forEach(pc => {
        if (pc) pc.close();
      });
      peerConnectionsRef.current = {};
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
      ctx.resume().catch(() => { });
    }

    try {
      source.disconnect();
      filter.disconnect();
      compressor.disconnect();
      distortion.disconnect();
      tremoloGain.disconnect();
    } catch {
      // no-op
    }


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
      // Even thinner, airier, and more whispering
      filter.type = "highpass";
      filter.frequency.value = 1500; // Increased from 800 for extra thinness
      filter.Q.value = 0.5;

      compressor.threshold.value = -45; // Lower threshold to pick up very quiet sounds
      compressor.ratio.value = 20; // Maximum compression for that "breath-y" feel

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
      "https://doctorprofile.runasp.net/callHub",
      "/callHub"
    ];

    let activeConnection = null;

    const setupPeerConnection = (hubConn, targetConnId) => {
      if (peerConnectionsRef.current[targetConnId]) return peerConnectionsRef.current[targetConnId];

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

      peerConnectionsRef.current[targetConnId] = pc;
      return pc;
    };

    const attachListeners = (hubConnection) => {
      hubConnection.on("ParticipantJoined", async (payload) => {
        const normalized = normalizeParticipant(payload);
        const joinedUserId = normalized.userId;
        const joinedConnId = normalized.connectionId;
        const myUserId = currentUser?.id;

        if (joinedUserId && myUserId && String(joinedUserId) === String(myUserId)) {
          return;
        }

        setParticipants((prev) => {
          const existingIdx = prev.findIndex((p) => (joinedUserId && String(p.userId) === String(joinedUserId)) || (joinedConnId && p.connectionId === joinedConnId));
          const identifiedParticipant = identifyParticipant(normalized, prev.length + 1);

          if (existingIdx !== -1) {
            const updated = [...prev];
            updated[existingIdx] = { ...updated[existingIdx], ...identifiedParticipant };
            return updated;
          }

          return [...prev, identifiedParticipant];
        });

        if (joinedConnId) {
          try {
            const pc = setupPeerConnection(hubConnection, joinedConnId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            const offerWithMeta = {
              type: offer.type,
              sdp: offer.sdp,
              meta_userId: currentUser?.id,
              meta_name: myName,
              meta_isDoctor: isDoctor
            };

            await hubConnection.invoke("SendOffer", roomId, joinedConnId, JSON.stringify(offerWithMeta));
          } catch (err) {
            console.error("Error creating offer", err);
          }
        }
      });

      hubConnection.on("ReceiveOffer", async (...args) => {
        try {
          let fromConnectionId, offerStr;
          if (args.length === 1 && typeof args[0] === 'object') {
            fromConnectionId = args[0].fromConnectionId || args[0].FromConnectionId;
            offerStr = args[0].sdp || args[0].Sdp;
          } else if (args.length >= 2) {
            fromConnectionId = args[0];
            offerStr = args[1];
            if (typeof args[2] === 'string' && args[2].includes('type')) {
              offerStr = args[2];
            }
          }
          if (!offerStr || !fromConnectionId) return;
          
          const offerWithMeta = JSON.parse(offerStr);
          
          const pc = setupPeerConnection(hubConnection, fromConnectionId);
          await pc.setRemoteDescription(new RTCSessionDescription(offerWithMeta));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await hubConnection.invoke("SendAnswer", fromConnectionId, JSON.stringify(answer));

          setParticipants((prev) => {
            const existingIdx = prev.findIndex((p) => p.connectionId === fromConnectionId);
            
            const syntheticPayload = {
              connectionId: fromConnectionId,
              userId: offerWithMeta.meta_userId || null,
              name: offerWithMeta.meta_name || null
            };
            
            const normalized = normalizeParticipant(syntheticPayload);
            const identified = identifyParticipant(normalized, prev.length + 1);
            
            if (offerWithMeta.meta_isDoctor) {
               identified.isDoctor = true;
               identified.name = otherPersonName || "Doctor"; 
            }

            if (existingIdx !== -1) {
              const updated = [...prev];
              updated[existingIdx] = { ...updated[existingIdx], ...identified };
              return updated;
            }
            return [...prev, identified];
          });
        } catch (err) {
          console.error("Error receiving offer and sending answer", err);
        }
      });

      hubConnection.on("ReceiveAnswer", async (...args) => {
        try {
          let fromConnectionId, answerStr;
          if (args.length === 1 && typeof args[0] === 'object') {
            fromConnectionId = args[0].fromConnectionId || args[0].FromConnectionId;
            answerStr = args[0].sdp || args[0].Sdp;
          } else if (args.length >= 2) {
            fromConnectionId = args[0];
            answerStr = args[1];
            if (typeof args[2] === 'string' && args[2].includes('type')) answerStr = args[2];
          }
          if (!answerStr || !fromConnectionId) return;
          
          const pc = peerConnectionsRef.current[fromConnectionId];
          if (pc) {
             const answer = JSON.parse(answerStr);
             await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        } catch (err) {
          console.error("Error handling answer", err);
        }
      });

      hubConnection.on("ReceiveIceCandidate", async (...args) => {
        try {
          let fromConnectionId, candidateStr;
          if (args.length === 1 && typeof args[0] === 'object') {
            fromConnectionId = args[0].fromConnectionId || args[0].FromConnectionId;
            candidateStr = args[0].candidate || args[0].Candidate;
          } else if (args.length >= 2) {
            fromConnectionId = args[0];
            candidateStr = args[1];
            if (typeof args[2] === 'string' && args[2].includes('candidate')) candidateStr = args[2];
          }
          if (!candidateStr || !fromConnectionId) return;
          
          const pc = peerConnectionsRef.current[fromConnectionId];
          if (pc) {
             const rtcCandidate = new RTCIceCandidate(JSON.parse(candidateStr));
             await pc.addIceCandidate(rtcCandidate);
          }
        } catch (err) {
          console.error("Error adding ICE candidate", err);
        }
      });

      hubConnection.on("ParticipantLeft", (payload) => {
        const normalized = normalizeParticipant(payload);
        const leftId = normalized.userId || normalized.connectionId || (typeof payload === 'string' ? payload : null);

        // Find the leaving participant to get their connectionId for WebRTC cleanup
        setParticipants((prev) => {
          const leavingParticipant = prev.find((p) => String(p.userId) === String(leftId) || String(p.connectionId) === String(leftId));
          if (leavingParticipant && leavingParticipant.connectionId) {
            const pc = peerConnectionsRef.current[leavingParticipant.connectionId];
            if (pc) {
              pc.close();
              delete peerConnectionsRef.current[leavingParticipant.connectionId];
            }
          }
          return prev.filter((p) => String(p.userId) !== String(leftId) && String(p.connectionId) !== String(leftId));
        });

        const isLeftUserDoctor = doctorId && String(leftId) === String(doctorId);

        if (!isGroup || isLeftUserDoctor) {
          setForceEndCall(true);
        }
      });

      hubConnection.on("CallEnded", () => {
        setForceEndCall(true);
      });

      hubConnection.onreconnecting(() => setConnectionStatus("Reconnecting..."));
      
      hubConnection.onreconnected(async () => {
        setConnectionStatus("Connected");
        try {
          await hubConnection.invoke("JoinCallRoom", roomId);
        } catch (err) {
          console.error("Failed to rejoin room after reconnect", err);
        }
      });
      
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
            setParticipants((prev) => {
              const myId = currentUser?.id;
              const others = existing.map((p, idx) => {
                const normalized = normalizeParticipant(p);
                return identifyParticipant(normalized, idx + 1);
              }).filter((p) => String(p.userId) !== String(myId));
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

      Object.values(peerConnectionsRef.current).forEach(pc => {
        if (pc) pc.close();
      });
      peerConnectionsRef.current = {};
    };
  }, [roomId, micReady]);

  useEffect(() => {
    if (forceEndCall) {
      if (!isDoctor && !isLeavingRef.current) {
        alert("The session has ended because the other participant left.");
      }
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
    isLeavingRef.current = true;
    try {
      if (isDoctor) {
        const callId = callData?.callSessionId || callData?.CallSessionId || callData?.id || callData?.Id || session?.sessionId || session?.sessionsId || session?.SessionsId || session?.id || session?.Id;
        if (callId) {
          try {
            await endCall(callId);
          } catch (endErr) {
            console.error("End call API failed:", endErr);
          }
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
                className={`fa-solid ${isMuted ? "fa-microphone-slash" : "fa-microphone"
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

              {/* Other Members (Patients) */}
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
              
              {/* Waiting Placeholder for Doctor or Patient */}
              {otherParticipants.length === 0 && (
                <div className="waiting-placeholder">
                  <div className="doctor-waiting-view">
                    {isDoctor ? (
                      <>
                        <i className="fa-solid fa-users-viewfinder mb-2" style={{ fontSize: '2rem', color: '#30bf94', opacity: 0.5 }}></i>
                        <h4 className="mt-2 mb-1" style={{ color: '#1f4137', fontWeight: '700' }}>
                          Waiting for participants...
                        </h4>
                        <p className="text-muted small">
                          The session will start as soon as members join
                        </p>
                      </>
                    ) : (
                      !isDoctorJoined && (
                        <>
                          <div className="avatar-ring small opacity-50">
                            <img
                              src={otherAvatarUrl}
                              alt="Doctor avatar"
                              className="avatar-image"
                            />
                          </div>
                          <h4 className="mt-2 mb-1" style={{ color: '#1f4137', fontWeight: '700' }}>
                            Waiting for {otherPersonName}...
                          </h4>
                          <p className="text-muted small">
                            Waiting for the session leader to join
                          </p>
                        </>
                      )
                    )}
                  </div>
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
                className={`fa-solid ${isMuted ? "fa-microphone-slash" : "fa-microphone"
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
                      className={`dropdown-item voice-item ${selectedVoice === option.label ? "active" : ""
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

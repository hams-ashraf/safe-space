import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import doctorImg from "../../assets/images.jfif";
import "./DoctorProfile.css";
import { getDoctorById } from "../../api/doctorsApi";


export default function DoctorProfile() {
  const { id } = useParams();
  console.log("DOCTOR ID:", id);
  const [doctor, setDoctor] = useState(null);
const [slots, setSlots] = useState([]);
const [selectedTime, setSelectedTime] = useState(null);
const [selectedDate, setSelectedDate] = useState("");
const [sessionType, setSessionType] = useState(0);
const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await getDoctorById(id);
        setDoctor(res.data);
        setReviews(res.data.review || []);
      } catch (err) {
        console.log(err);
      }
    }

    fetchDoctor();
    
  }, [id]);
  

  useEffect(() => {
  if (!selectedDate || !id) return;

  async function fetchSlots() {
    try {
const formattedDate = selectedDate;

const res = await fetch(
  `http://doctorprofile.runasp.net/api/Sessions/AvailableSlots?DoctorId=${id}&date=${formattedDate}&type=${sessionType}`
);
const data = await res.json();
 

console.log("RAW API RESPONSE:", data);
console.log("sessionType:", sessionType);
console.log("selectedDate:", selectedDate);


setSlots(data);

      
    } catch (err) {
      console.log("SLOTS ERROR:", err);
      setSlots([]);
    }
  }

  fetchSlots();
}, [selectedDate, sessionType, id]);
  

  const filteredSlots = slots.filter(
  slot =>
    sessionType === 0
      ? slot.slotType === "OneToOne"
      : slot.slotType === "Group"
);

console.log("ALL SLOTS FROM STATE:", slots);
console.log("FILTERED SLOTS:", filteredSlots);

const slotChips = filteredSlots.map(slot => ({
  id: slot.availableSlotsId,
  label: slot.time,
  disabled: slot.isBooked
}));
const handleBookSession = async () => {
  if (!selectedTime) {
    alert("Please select a time first");
    return;
  }

  const selectedSlot = slots.find(
    (s) => s.time === selectedTime
  );

  if (!selectedSlot) {
    alert("There is a problem with the selected time");
    return;
  }

  try {
   const token = localStorage.getItem("token");

const res = await fetch(
  "http://doctorprofile.runasp.net/api/Sessions/Book",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      availableSlotsId: selectedSlot.availableSlotsId,
    }),
  }
);

if (res.ok) {
  alert("Session booked successfully");

  setSlots((prev) =>
    prev.map((s) =>
      s.availableSlotsId === selectedSlot.availableSlotsId
        ? { ...s, isBooked: true }
        : s
    )
  );

  setSelectedTime(null);
  

} else {
  const errorText = await res.text();
  console.log("BOOKING ERROR:", errorText);
  alert("Booking failed");
}
  } catch (err) {
    console.log(err);
    alert("Something went wrong");
  }
};

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="doctor-w-90 doctor-root">
      <section className="mt-5">
        <div className="doctor-bg-white rounded-4 shadow p-5">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-4">
              <div className="position-relative doctor-photo-wrap">
                <div className="overflow-hidden rounded-4">
                  <img
                    src={
                      doctor
                        ? `http://doctorprofile.runasp.net${doctor.imageUrl}`
                        : doctorImg
                    }
                    className="w-100 doctor-photo"
                    alt="Doctor"
                  />
                </div>
                <div className="doctor-rating-badge">
                  <i className="fa-solid fa-star text-warning me-1"></i>
                  <span className="fw-bold">4.9</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-8">
              <h2 className="fw-bolder mb-1">
                {doctor ? doctor.fullName : "Loading..."}
              </h2>

              <p className="doctor-text-gray mb-1">
                {doctor?.position || doctor?.specialization}
              </p>

              <p className="doctor-text-green mb-4 doctor-specialties">
                Specializes in: {doctor?.specialization}
              </p>

              <div className="row g-3">
                {[
                  {
                    icon: "fa-briefcase",
                    label: "Experience",
                    value: `${doctor?.yearOfExperience || 0} years`,
                    color: "doctor-text-green"
                  },
                  {
                    icon: "fa-star",
                    label: "Rating",
                    value: `${doctor?.rating || 0}/5.0`,
                    color: "text-warning"
                  },
                  {
                    icon: "fa-regular fa-message",
                    label: "Reviews",
                    value: doctor?.reviewsCount || 0,
                    color: "doctor-text-green"
                  }
                ].map(({ icon, label, value, color }) => (
                  <div className="col-12 col-md-4" key={label}>
                    <div className="doctor-bg rounded-4 p-3 doctor-stat">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className={`fa-solid ${icon} ${color}`}></i>
                        <small className="doctor-text-gray fw-bold">
                          {label}
                        </small>
                      </div>
                      <div className="fw-bolder">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="doctor-cta-wrapper mt-4">
                <button
                  className="doctor-btn-outline-green px-4 py-3 doctor-cta-secondary doctor-w-48 rounded-4"
                  type="button"
                >
                  <i className="fa-regular fa-comment-dots me-2"></i>
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 pb-5">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-8">
            <div className="doctor-bg-white rounded-4 shadow p-4">
              <div className="border-bottom">
                <h5 className="fw-bolder mb-3">About</h5>
                <p className="doctor-text-gray small mb-3">
                  {doctor?.about || "No information provided yet."}
                </p>
              </div>

              <div className="mt-3">
                <h6 className="fw-bolder mb-2">Therapy Approach</h6>
                <p className="doctor-text-gray small mb-0">
                  {doctor?.therapyApproach ||
                    "Therapy approach is not available yet."}
                </p>
              </div>
            </div>

            <div className="doctor-bg-white rounded-4 shadow p-4 mt-4">
              <h5 className="fw-bolder mb-3">
                Certifications & Credentials
              </h5>

              <ul className="mb-0 ps-0 doctor-credential-list">
                {doctor?.certifications?.length ? (
                  doctor.certifications.map((c, index) => (
                    <li
                      key={index}
                      className="d-flex gap-2 align-items-start mb-2"
                    >
                      <i className="fa-solid fa-circle doctor-text-green mt-1 smallfont"></i>
                      <span className="doctor-text-gray small">{c}</span>
                    </li>
                  ))
                ) : (
                  <li className="d-flex gap-2 align-items-start mb-2">
                    <i className="fa-solid fa-circle doctor-text-green mt-1 smallfont"></i>
                    <span className="doctor-text-gray small">
                      No certifications listed yet.
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <div className="doctor-bg-white rounded-4 shadow p-4 mt-4">

            <h5 className="fw-bolder mb-3">Client Reviews</h5>

            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <div className="review-left">

                      <div className="review-avatar">
                        {review.userDisplayName?.[0] || "A"}
                      </div>

                      <div className="review-user">
                        <h6 className="mb-0 fw-bold">Anonymous</h6>
                        <small className="doctor-text-gray">
                          {review.formattedDate}
                        </small>
                      </div>

                    </div>
                    <div className="review-stars">
                      {"★".repeat(review.reviewValue)}
                      {"☆".repeat(5 - review.reviewValue)}
                    </div>

                  </div>
                  <p className="review-text mb-0">
                    "{review.reviewDescription}"
                  </p>

                  {index !== reviews.length - 1 && (
                    <hr className="review-divider" />
                  )}

                </div>
              ))
            ) : (
              <p className="doctor-text-gray mb-0">No reviews yet</p>
            )}

          </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="doctor-bg-white rounded-4 shadow p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="fa-regular fa-calendar doctor-text-green"></i>
                <h5 className="fw-bolder mb-0">Available Slots</h5>
              </div>

              <div className="doctor-w-90">
                <label className="small fw-bold">Select Date</label>

                <input
                  type="date"
                  className="form-control rounded-4 mt-2 doctor-input"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime(null);
                    
                  }}
                />

                {/* session type buttons */}
                <div className="row g-2 mt-2">
                  <div className="col-6">
                    <button
                      type="button"
                      className={`doctor-time-chip ${
                        sessionType === 0
                          ? "doctor-time-chip--active"
                          : ""
                      }`}
                      onClick={() => {
                        setSessionType(0);
                        setSelectedTime(null);
                        
                      }}
                    >
                      One-to-One
                    </button>
                  </div>

                  <div className="col-6">
                    <button
                      type="button"
                      className={`doctor-time-chip ${
                        sessionType === 1
                          ? "doctor-time-chip--active"
                          : ""
                      }`}
                      onClick={() => {
                        setSessionType(1);
                        setSelectedTime(null);
                        setSlots([]);
                      }}
                    >
                      Group Session
                    </button>
                  </div>
                </div>

                {/* slots */}
                <div className="mt-3">
                  <label className="small fw-bold">Select Time</label>

                  <div className="row g-2 mt-2">
                    {slotChips.length === 0 ? (
                      <p className="doctor-text-gray small">
                        No available slots
                      </p>
                    ) : (
                      slotChips.map((slot) => (
                        <div className="col-6" key={slot.id}>
                          <button
                            className={`doctor-time-chip ${
                              selectedTime === slot.label
                                ? "doctor-time-chip--active"
                                : ""
                            }`}
                            disabled={slot.disabled}
                            onClick={() =>
                              !slot.disabled &&
                              setSelectedTime(slot.label)
                            }
                          >
                            {slot.label}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="justify-content-center d-flex mt-3">
                  <button
                    className="doctor-btn doctor-big-btn"
                    type="button"
                    onClick={handleBookSession}
                  >
                    Book Session
                  </button>
                </div>

                <div className="doctor-bg rounded-4 p-3 mt-3">
                  <small className="doctor-text-gray d-block mb-2">
                    Session Details
                  </small>
                  <small className="d-block">50-minute session</small>
                  <small className="doctor-text-gray d-block">
                    Video or voice call
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
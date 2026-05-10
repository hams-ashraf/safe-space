
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorImg from "../../assets/images.jfif";
import "../DoctorProfile/DoctorProfile.css";
import "./MyProfileDoctor.css";
import { getDoctorById } from "../../api/doctorsApi";
import { addDoctorSlot } from "../../api/doctorsApi";

const doctorId = localStorage.getItem("doctorId");

if (!doctorId) {
  console.log("No doctorId found");
}

/** Sample reviews matching the Client Reviews reference layout */
// const MOCK_CLIENT_REVIEWS = [
//   {
//     id: "r1",
//     initials: "M.T.",
//     displayName: "Anonymous",
//     dateLabel: "Feb 2026",
//     rating: 5,
//     comment:
//       "Dr. Johnson has been incredibly supportive throughout my journey. Her approach is gentle yet effective.",
//   },
//   {
//     id: "r2",
//     initials: "R.K.",
//     displayName: "Anonymous",
//     dateLabel: "Jan 2026",
//     rating: 5,
//     comment:
//       "Highly recommend! She truly listens and provides practical strategies that have made a real difference.",
//   },
//   {
//     id: "r3",
//     initials: "L.S.",
//     displayName: "Anonymous",
//     dateLabel: "Jan 2026",
//     rating: 4,
//     comment:
//       "Professional and empathetic. I feel comfortable sharing my thoughts and concerns with Dr. Johnson.",
//   },
// ];

const MOCK_DOCTOR = {
  fullName: "Dr. Sample Physician",
  specialization: "Psychiatry",
  position: "Lead Consultant",
  yearOfExperience: 10,
  rating: 4.8,
  reviewsCount: 36,
  about:
    "Experienced clinician focused on evidence-based care and collaborative treatment planning.",
  therapyApproach:
    "Collaborative, patient-centered sessions combining CBT techniques with supportive listening.",
  certifications: [
    "Board Certified Psychiatry",
    "Advanced Trauma-Informed Care Certificate",
  ],
//   reviews: MOCK_CLIENT_REVIEWS,
  imageUrl: null,
};

export default function MyProfileDoctor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [slotSessionType, setSlotSessionType] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
  const id = localStorage.getItem("doctorId");

  if (!id) {
    setDoctor(MOCK_DOCTOR);
    setLoading(false);
    return;
  }

  let cancelled = false;

  async function load() {
  try {
    setLoading(true);

    const res = await getDoctorById(id);

    if (!cancelled) {
      setDoctor(res?.data || MOCK_DOCTOR);
      setReviews(res?.data?.review || res?.data?.reviews || []);
    }

  } catch (err) {
    console.log(err);
    if (!cancelled) {
      setDoctor(MOCK_DOCTOR);
      setReviews([]);
    }
  } finally {
    if (!cancelled) setLoading(false);
  }
}

  load();

  return () => {
    cancelled = true;
  };
}, []);

  const handleAddSlot = async () => {
  console.log("BTN CLICKED 🔥");

  if (!slotDate || !slotTime) return;

  try {
    const data = {
      date: `${slotDate}T${slotTime}:00.000Z`,
      time: slotTime,
      type: slotSessionType === 0 ? "OneToOne" : "Group",
    };

    console.log("Sending data:", data);

    await addDoctorSlot(data);

    alert("Slot added successfully ✅");

    setSlotDate("");
    setSlotTime("");
    setSlotSessionType(0);

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to add slot ❌");
  }
};

  if (loading) {
  return (
    <div className="doctor-w-90 doctor-root py-5">
      <p className="doctor-text-gray">Loading...</p>
    </div>
  );
}

  const imageSrc = doctor.imageUrl
    ? `http://doctorprofile.runasp.net${doctor.imageUrl}`
    : doctorImg;

  const certs = doctor.certifications?.length
    ? doctor.certifications
    : null;

  return (
    <div className="doctor-w-90 doctor-root">
      <section className="mt-5">
        <div className="doctor-bg-white rounded-4 shadow p-5">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-4">
              <div className="position-relative doctor-photo-wrap">
                <div className="overflow-hidden rounded-4">
                  <img
                    src={imageSrc}
                    className="w-100 doctor-photo"
                    alt={doctor.fullName || "Doctor"}
                  />
                </div>
                <div className="doctor-rating-badge">
                  <i className="fa-solid fa-star text-warning me-1"></i>
                  <span className="fw-bold">{doctor.rating ?? "—"}</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-8">
              <h2 className="fw-bolder mb-1">{doctor.fullName}</h2>
              <p className="doctor-text-gray mb-1">
                {doctor.position || doctor.specialization}
              </p>
              <p className="doctor-text-green mb-4 doctor-specialties">
                Specializes in: {doctor.specialization}
              </p>

              <div className="row g-3">
                {[
                  {
                    icon: "fa-briefcase",
                    label: "Experience",
                    value: `${doctor.yearOfExperience ?? doctor.experience ?? 0} years`,
                    color: "doctor-text-green",
                  },
                  {
                    icon: "fa-star",
                    label: "Rating",
                    value: `${doctor.rating ?? 0}/5.0`,
                    color: "text-warning",
                  },
                  {
                    icon: "fa-regular fa-message",
                    label: "Reviews",
                    value: doctor.reviewsCount ?? doctor.reviews ?? 0,
                    color: "doctor-text-green",
                  },
                ].map(({ icon, label, value, color }) => (
                  <div className="col-12 col-md-4" key={label}>
                    <div className="doctor-bg rounded-4 p-3 doctor-stat">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className={`fa-solid ${icon} ${color}`}></i>
                        <small className="doctor-text-gray fw-bold">{label}</small>
                      </div>
                      <div className="fw-bolder">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-3 mt-4 flex-wrap my-profile-doctor-actions">
                <button
                  type="button"
                  className="doctor-btn-outline-green px-4 py-3 doctor-cta-secondary rounded-4 flex-grow-1 my-profile-doctor-actions-btn"
                  onClick={() => navigate("/doctor/edit-profile")}
                >
                  <i className="fa-solid fa-pen-to-square me-2"></i>
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="doctor-btn px-4 py-3 rounded-4 flex-grow-1 my-profile-doctor-actions-btn my-profile-doctor-actions-btn--solid"
                  onClick={() => navigate("/doctor/history")}
                >
                  <i className="fa-solid fa-clock-rotate-left me-2"></i>
                  View History
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
                  {doctor.about || "No information provided yet."}
                </p>
              </div>

              <div className="mt-3">
                <h6 className="fw-bolder mb-2">Therapy Approach</h6>
                <p className="doctor-text-gray small mb-0">
                  {doctor.therapyApproach ||
                    "Therapy approach is not available yet."}
                </p>
              </div>
            </div>

            <div className="doctor-bg-white rounded-4 shadow p-4 mt-4">
              <h5 className="fw-bolder mb-3">Certifications & Credentials</h5>

              <ul className="mb-0 ps-0 doctor-credential-list">
                {certs?.length ? (
                  certs.map((c, index) => (
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

                        {index !== reviews.length - 1 && <hr />}
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
                <h5 className="fw-bolder mb-0">Available slots</h5>
              </div>

              <div className="doctor-w-90">
                <label className="small fw-bold">Select date</label>
                <input
                  type="date"
                  className="form-control rounded-4 mt-2 doctor-input"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                />

                <label className="small fw-bold d-block mt-3">Session type</label>
                <div className="row g-2 mt-2">
                  <div className="col-6">
                    <button
                      type="button"
                      className={`doctor-time-chip ${
                        slotSessionType === 0 ? "doctor-time-chip--active" : ""
                      }`}
                      onClick={() => setSlotSessionType(0)}
                    >
                      One-to-One
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className={`doctor-time-chip ${
                        slotSessionType === 1 ? "doctor-time-chip--active" : ""
                      }`}
                      onClick={() => setSlotSessionType(1)}
                    >
                      Group
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="small fw-bold" htmlFor="doctor-slot-time">
                    Select time
                  </label>
                  <input
                    id="doctor-slot-time"
                    type="time"
                    className="form-control rounded-4 mt-2 doctor-input"
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                  />
                </div>

                <div className="justify-content-center d-flex mt-3">
                  <button
                    className="doctor-btn doctor-big-btn"
                    type="button"
                    onClick={handleAddSlot}
                    disabled={!slotDate || !slotTime}
                  >
                    Add Slot
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

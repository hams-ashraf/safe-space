import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import doctorImg from "../../assets/images.jfif";
import "./DoctorProfile.css";
import { getDoctorById } from "../../api/doctorsApi";

export default function DoctorProfile() {
  const { id } = useParams();
  const [selectedTime, setSelectedTime] = useState(null);
  const [doctor, setDoctor] = useState(null);
useEffect(() => {
  async function fetchDoctor() {
    try {
      const res = await getDoctorById(id);
      setDoctor(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  fetchDoctor();
}, [id]);

  const slots = [
    { label: "9:00 AM", disabled: false },
    { label: "11:00 AM", disabled: false },
    { label: "12:00 PM", disabled: true },
    { label: "1:00 PM", disabled: false },
    { label: "2:00 PM", disabled: true },
    { label: "4:30 PM", disabled: false },
  ];
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
                      src={doctor ? `http://doctorprofile.runasp.net${doctor.imageUrl}` : doctorImg}
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
              <p className="doctor-text-gray mb-1">{doctor?.position || doctor?.specialization}</p>
              <p className="doctor-text-green mb-4 doctor-specialties">
                Specializes in: {doctor?.specialization}
              </p>

              <div className="row g-3">
                {[
                  { icon: "fa-briefcase", label: "Experience",value: `${doctor?.yearOfExperience || 0} years`, color: "doctor-text-green" },
                  { icon: "fa-star", label: "Rating",value: `${doctor?.rating || 0}/5.0`, color: "text-warning" },
                  { icon: "fa-regular fa-message", label: "Reviews",value: doctor?.reviewsCount || 0, color: "doctor-text-green" },
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

              <div className="d-flex gap-3 mt-4 flex-wrap justify-content-between">
                <button className="doctor-btn px-4 py-3 doctor-cta-primary doctor-w-48" type="button">
                  <i className="fa-regular fa-calendar me-2"></i>
                  Book Session
                </button>
                <button className="doctor-btn-outline-green px-4 py-3 doctor-cta-secondary doctor-w-48 rounded-4" type="button">
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
                  {doctor?.about}.
                </p>
              </div>

              <div className="mt-3">
                <h6 className="fw-bolder mb-2">Therapy Approach</h6>
                <p className="doctor-text-gray small mb-0">
                  {doctor?.therapyApproach}
                </p>
              </div>
            </div>

            <div className="doctor-bg-white rounded-4 shadow p-4 mt-4">
              <h5 className="fw-bolder mb-3">Certifications & Credentials</h5>

              <ul className="mb-0 ps-0 doctor-credential-list">
                {doctor?.certifications?.map((c, index) => (
                  <li key={index} className="d-flex gap-2 align-items-start mb-2">
                    <i className="fa-solid fa-circle doctor-text-green mt-1 smallfont"></i>
                    <span className="doctor-text-gray small">{c}</span>
                  </li>
                ))}
              </ul>
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
                />

                <div className="mt-3">
                  <label className="small fw-bold">Select Time</label>

                  <div className="row g-2 mt-2">
                    {slots.map(({ label, disabled }) => (
                      <div className="col-6" key={label}>
                        <button
                          className={`doctor-time-chip ${
                            selectedTime === label ? "doctor-time-chip--active" : ""
                          } ${disabled ? "doctor-time-chip--disabled" : ""}`}
                          type="button"
                          disabled={disabled}
                          onClick={() => !disabled && setSelectedTime(label)}
                        >
                          {label}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="justify-content-center d-flex mt-3">
                  <button className="doctor-btn doctor-big-btn" type="button">
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
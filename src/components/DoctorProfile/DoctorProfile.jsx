import { useState } from "react";
import doctorImg from "../../assets/images.jfif";
import "./DoctorProfile.css";

export default function DoctorProfile() {
  const [selectedTime, setSelectedTime] = useState(null);

  const slots = [
    { label: "9:00 AM", disabled: false },
    { label: "11:00 AM", disabled: false },
    { label: "12:00 PM", disabled: true },
    { label: "1:00 PM", disabled: false },
    { label: "2:00 PM", disabled: true },
    { label: "4:30 PM", disabled: false },
  ];

  return (
    <div className="w-90 bg doctor-root">
      <section className="mt-5">
        <div className="bg-white rounded-4 shadow p-5">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-4">
              <div className="position-relative doctor-photo-wrap">
                <div className="overflow-hidden rounded-4">
                  <img
                    src={doctorImg}
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
              <h2 className="fw-bolder mb-1">Dr. Sarah Johnson</h2>
              <p className="text-gray mb-1">Clinical Psychologist</p>
              <p className="text-green mb-4 doctor-specialties">
                Specializes in: Anxiety &amp; Depression
              </p>

              <div className="row g-3">
                {[
                  { icon: "fa-briefcase", label: "Experience", value: "12 years", color: "text-green" },
                  { icon: "fa-star", label: "Rating", value: "4.9/5.0", color: "text-warning" },
                  { icon: "fa-regular fa-message", label: "Reviews", value: "287", color: "text-green" },
                ].map(({ icon, label, value, color }) => (
                  <div className="col-12 col-md-4" key={label}>
                    <div className="bg rounded-4 p-3 doctor-stat">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className={`fa-solid ${icon} ${color}`}></i>
                        <small className="text-gray fw-bold">{label}</small>
                      </div>
                      <div className="fw-bolder">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-3 mt-4 flex-wrap justify-content-between">
                <button className="btn px-4 py-3 doctor-cta-primary w-49" type="button">
                  <i className="fa-regular fa-calendar me-2"></i>
                  Book Session
                </button>
                <button className="btn btn-outline-green px-4 py-3 doctor-cta-secondary w-49" type="button">
                  <i className="fa-regular fa-comment-dots me-2"></i>
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About + Credentials + Reviews */}
      <section className="mt-4 pb-5">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-8">
            {/* About */}
            <div className="bg-white rounded-4 shadow p-4">
              <div className="border-bottom">
                <h5 className="fw-bolder mb-3">About</h5>
                <p className="text-gray small mb-3">
                  Dr. Sarah Johnson is a dedicated clinical psychologist with over 12 years of
                  experience helping individuals overcome anxiety, depression, and stress-related
                  challenges. She believes in creating a warm, non-judgmental space where clients feel
                  heard and supported.
                </p>
              </div>
              <div className="mt-3">
                <h6 className="fw-bolder mb-2">Therapy Approach</h6>
                <p className="text-gray small mb-0">
                  I use evidence-based approaches including Cognitive Behavioral Therapy (CBT),
                  Mindfulness-Based Stress Reduction (MBSR), and person-centered therapy. My goal is to
                  help you develop practical coping skills while addressing the root causes of your
                  concerns.
                </p>
              </div>
            </div>

            {/* Credentials */}
            <div className="bg-white rounded-4 shadow p-4 mt-4">
              <h5 className="fw-bolder mb-3">Certifications & Credentials</h5>
              <ul className="mb-0 ps-0 doctor-credential-list">
                {[
                  "Licensed Clinical Psychologist (LCP)",
                  "Certified CBT Practitioner",
                  "MBSR Instructor Certification",
                  "Trauma-Informed Care Specialist",
                ].map((c) => (
                  <li key={c} className="d-flex gap-2 align-items-start mb-2">
                    <i className="fa-solid fa-circle text-green mt-1 smallfont"></i>
                    <span className="text-gray small">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-4 shadow p-4 mt-4">
              <h5 className="fw-bolder mb-3">Client Reviews</h5>
              {[
                { initials: "M", date: "Feb 2026", stars: 5, text: "Dr. Johnson has been incredibly supportive throughout my journey. Her approach is gentle yet effective." },
                { initials: "RK", date: "Jan 2026", stars: 5, text: "Highly recommended. She truly listens and provides practical strategies that have made a real difference." },
                { initials: "LS", date: "Jan 2026", stars: 4.5, text: "Professional and empathetic. I felt comfortable sharing my thoughts and concerns with Dr. Johnson." },
              ].map(({ initials, date, stars, text }, i, arr) => (
                <div key={i} className={`doctor-review ${i < arr.length - 1 ? "pb-3 border-bottom" : "pt-3"}`}>
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div className="d-flex gap-3 align-items-start">
                      <div className="doctor-avatar bg-green rounded-circle d-flex justify-content-center align-items-center">
                        <small className="fw-bolder text-light">{initials}</small>
                      </div>
                      <div>
                        <div className="fw-bolder smallfont">Anonymous</div>
                        <small className="text-gray smallfont">{date}</small>
                      </div>
                    </div>
                    <div className="doctor-stars">
                      {[1, 2, 3, 4].map((s) => <i key={s} className="fa-solid fa-star text-warning"></i>)}
                      {stars === 5 ? <i className="fa-solid fa-star text-warning"></i> : <i className="fa-solid fa-star-half-stroke text-warning"></i>}
                    </div>
                  </div>
                  <p className="text-gray smallfont mb-0 mt-2">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking */}
          <div className="col-12 col-lg-4">
            <div className="bg-white rounded-4 shadow p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="fa-regular fa-calendar text-green"></i>
                <h5 className="fw-bolder mb-0">Available Slots</h5>
              </div>

              <div className="w-90">
                <label className="small fw-bold">Select Date</label>
                <input type="date" className="form-control rounded-4 mt-2 doctor-input" defaultValue="2026-02-24" />

                <div className="mt-3">
                  <label className="small fw-bold">Select Time</label>
                  <div className="row g-2 mt-2">
                    {slots.map(({ label, disabled }) => (
                      <div className="col-6" key={label}>
                        <button
                          className={`time-chip ${
                            selectedTime === label ? "time-chip--active" : ""
                          } ${disabled ? "time-chip--disabled" : ""}`}
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
                  <button className="btn big-btn" type="button">Book Session</button>
                </div>

                <div className="bg rounded-4 p-3 mt-3">
                  <small className="text-gray d-block mb-2">Session Details</small>
                  <small className="d-block">50-minute session</small>
                  <small className="text-gray d-block">Video or voice call</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
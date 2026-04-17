import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDoctors } from "../../api/doctorsApi";
import doctorImg from "../../assets/images.jfif";
import "./DoctorProfile.css";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const slots = [
    { label: "9:00 AM", disabled: false },
    { label: "11:00 AM", disabled: false },
    { label: "12:00 PM", disabled: true },
    { label: "1:00 PM", disabled: false },
    { label: "2:00 PM", disabled: true },
    { label: "4:30 PM", disabled: false },
  ];

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await getDoctors();
        const doctorByIndex = res.data[Number(id)];
        setDoctor(doctorByIndex);
      } catch (err) {
        console.log(err);
      }
    }
    fetchDoctor();
  }, [id]);

  if (!doctor) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <div className="doctor-root">
      <section className="mt-5 w-100">
        <div className="bg-white rounded-4 shadow p-5">
          <div className="row g-4 align-items-center">

            {/* IMAGE */}
            <div className="col-12 col-lg-4">
              <div className="position-relative doctor-photo-wrap">
                <div className="overflow-hidden rounded-4 doctor-photo-wrap">
                  <img
                    src={
                      doctor.imageUrl
                        ? `http://doctorprofile.runasp.net${doctor.imageUrl}`
                        : doctorImg
                    }
                    className="w-100"
                    alt={doctor.fullName}
                  />
                </div>

                <div className="doctor-rating-badge">
                  <i className="fa-solid fa-star text-warning me-1"></i>
                  <span className="fw-bold">{doctor.rating || "4.9"}</span>
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="col-12 col-lg-8">
              <h2 className="fw-bolder mb-1">{doctor.fullName}</h2>
              <p className="text-gray mb-1">{doctor.position}</p>

              <p className="text-green mb-4 doctor-specialties">
                Specializes in: {doctor.specialization}
              </p>

              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="doctor-bg rounded-4 p-3">
                    <small className="text-gray fw-bold">Experience</small>
                    <div className="fw-bolder">
                      {doctor.yearOfExperience || 10} years
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="doctor-bg rounded-4 p-3">
                    <small className="text-gray fw-bold">Rating</small>
                    <div className="fw-bolder">{doctor.rating || "4.9"}</div>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="doctor-bg rounded-4 p-3">
                    <small className="text-gray fw-bold">Reviews</small>
                    <div className="fw-bolder">{doctor.reviewsCount || 0}</div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 mt-4 flex-wrap justify-content-between">
                <button className="doctor-btn doctor-big-btn" type="button">
                  Book Session
                </button>

                <button className="doctor-btn-outline-green doctor-big-btn">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="mt-4 pb-5 w-100">
        <div className="row g-4">

          {/* LEFT */}
          <div className="col-12 col-lg-8">

            <div className="doctor-bg-white rounded-4 shadow p-4">
              <h5 className="fw-bolder mb-3">About</h5>
              <p className="doctor-text-gray small mb-0">
                Dr. {doctor.fullName} is a clinical psychologist with experience
                helping patients with anxiety, depression and stress.
              </p>
            </div>

            <div className="doctor-bg-white rounded-4 shadow p-4 mt-4">
              <h5 className="fw-bolder mb-3">Certifications</h5>
              <ul className="ps-0">
                <li>Licensed Clinical Psychologist</li>
                <li>CBT Certified</li>
                <li>MBSR Training</li>
              </ul>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-12 col-lg-4">

            <div className="doctor-bg-white rounded-4 shadow p-4">
              <h5 className="fw-bolder mb-3">Available Slots</h5>

              <div className="row g-2">
                {slots.map(({ label, disabled }) => (
                  <div className="col-6" key={label}>
                    <button
                      className={`doctor-time-chip ${
                        selectedTime === label
                          ? "doctor-time-chip--active"
                          : ""
                      } ${disabled ? "doctor-time-chip--disabled" : ""}`}
                      disabled={disabled}
                      onClick={() => setSelectedTime(label)}
                    >
                      {label}
                    </button>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center mt-3">
                <button className="doctor-btn doctor-big-btn">
                  Book Session
                </button>
              </div>

              <div className="doctor-bg rounded-4 p-3 mt-3">
                <small className="doctor-text-gray">
                  50-minute video/voice session
                </small>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
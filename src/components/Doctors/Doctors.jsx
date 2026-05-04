import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../../api/doctorsApi";
import { isPatientUser } from "../../api/roleApi";
import "./Doctors.css";

export default function Doctors() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const showCardActions = isPatientUser();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await getDoctors();
        setTherapists(res.data);
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="doctors-therapist-page">
      <h2 className="doctors-page-title text-center">Find Your Therapist</h2>
      <p className="doctors-page-subtitle text-center">
        Browse our network of licensed mental health professionals
      </p>

      <div className="doctors-container-fluid">
        <div className="row row-cols-3 g-4">
          {therapists.map((t, index) => (
            <div className="col" key={index}>
              <div className="doctors-therapist-card">
                <div className="doctors-img-wrapper">
                  <img
                    src={`http://doctorprofile.runasp.net${t.imageUrl}`}
                    alt={t.fullName}
                  />
                  <span className="doctors-rating-badge">⭐ {t.rating}</span>
                </div>

                <div className="card-body">
                  <h5 className="fw-bold">{t.fullName}</h5>
                  <p className="small text-muted mb-1">
                    {t.position || t.specialization}
                  </p>
                  <p className="small text-success mb-3">
                    {t.specialization}
                  </p>

                  <div className="d-flex justify-content-between small text-muted mb-3">
                    <span>
                      <strong>Experience</strong><br />
                      {t.yearOfExperience} years
                    </span>
                    <span className="text-end">
                      <strong>Reviews</strong><br />
                      {t.reviewsCount}
                    </span>
                  </div>

                  {showCardActions && (
                    <>
                      <button
                        className="btn doctors-btn-main w-100 mb-2"
                        onClick={() => navigate(`/doctorprofile/${t.id}`)}
                      >
                        View Profile
                      </button>

                      <button
                        className="btn doctors-btn-outline-main w-100"
                        onClick={() => navigate("/chat")}
                      >
                        Start Chat
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
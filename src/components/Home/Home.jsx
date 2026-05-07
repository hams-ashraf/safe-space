import React, { useEffect, useState } from "react";
import { getDoctors } from "../../api/doctorsApi";
import { useNavigate, Link } from "react-router-dom";


import "./Home.css";

export default function Home() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
 useEffect(() => {
  async function fetchDoctors() {
    try {
      const res = await getDoctors();
      setTherapists(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  }
  fetchDoctors();
}, []);

  // Top 3 rated doctors
  const topRatedDoctors = [...therapists]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <div className="container py-5">
          <h1 className="display-3 fw-bold mb-3">
            Your Safe Space for Mental Health Support
          </h1>
          <p className="lead fs-4 mb-4">
            Connect anonymously with licensed therapists through private voice
            sessions, join supportive group therapy, or chat instantly with our AI
            assistant.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button className="custom-button" onClick={() => navigate("/doctors")}>
              <i className="fa-solid fa-user-doctor"></i> Find a Therapist
            </button>
            <button className="custom-button" onClick={() => navigate("/ai-chat")} >
              <i className="fa-solid fa-robot"></i> Chat with AI
            </button>
          </div>
        </div>
      </section>

      {/* Top Rated Therapists Section */}
      <section id="top-rated" className="section-bg py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5" style={{ color: "#41655d" }}> Top Rated Therapists</h2>

    {loading && <p className="text-center">Loading doctors...</p>}
    {error && <p className="text-danger text-center">{error}</p>}

    <div className="row g-4">
      {topRatedDoctors.map((t) => (
  <div className="col-md-4" key={t.id}>
    <div
      className="card shadow-sm text-center top-rated-card h-100 d-flex flex-column"
      onClick={() => navigate(`/doctor/${t.id}`)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={`http://doctorprofile.runasp.net${t.imageUrl}`}
        className="card-img-top"
        alt={t.fullName}
      />

      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">{t.fullName}</h5>
        <p className="card-text">{t.specialization}</p>

        <div className="text-warning">
          {Array.from({ length: Math.floor(t.rating) }).map((_, i) => (
            <i key={i} className="fa-solid fa-star"></i>
          ))}
          {Array.from({ length: 5 - Math.floor(t.rating) }).map((_, i) => (
            <i key={i} className="fa-regular fa-star"></i>
          ))}
        </div>

        <p className="card-text mb-0 mt-3 flex-grow-1 d-flex align-items-center justify-content-center text-center">
          Years of Experience: {t.yearOfExperience}
        </p>
      </div>
    </div>
  </div>
))}
    </div>
  </div>
</section>
{/* Section 3: Anonymous Feedback */}
<section className="feedback-section py-5">
  <div className="container">
    <h2 className="text-center fw-bold mb-5">Anonymous Feedback 💬</h2>
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card shadow-sm h-100 p-4 text-center">
          <div className="text-warning mb-3 fs-5">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
          <p className="text-muted fst-italic">
            “I finally felt safe talking about things I never shared before.
            The anonymous feature made all the difference.”
          </p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm h-100 p-4 text-center">
          <div className="text-warning mb-3 fs-5">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-regular fa-star"></i>
          </div>
          <p className="text-muted fst-italic">
            “This platform helped me during one of the hardest times in my life.
            Knowing my identity was protected gave me peace.”
          </p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm h-100 p-4 text-center">
          <div className="text-warning mb-3 fs-5">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
          <p className="text-muted fst-italic">
            “A truly safe space. I felt heard, respected, and supported
            without fear of judgment.”
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      
    </>
  )
}

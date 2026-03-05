
import React from "react";
import "./Therapist.css";
import { useNavigate } from "react-router-dom";

const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Clinical Psychologist",
    tags: "Anxiety & Depression",
    experience: "12 years",
    reviews: 287,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Psychiatrist",
    tags: "Mood Disorders & PTSD",
    experience: "15 years",
    reviews: 342,
    rating: 5,
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=800"
  },
  {
    id: 3,
    name: "Dr. Emily Zhang",
    role: "Family Therapist",
    tags: "Family & Relationship Issues",
    experience: "10 years",
    reviews: 219,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800"
  },
  {
    id: 4,
    name: "Dr. Emily Zhang",
    role: "Family Therapist",
    tags: "Family & Relationship Issues",
    experience: "10 years",
    reviews: 219,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?crop=entropy&cs=tinysrgb&fit=max&w=800&q=80"
  },
  {
    id: 5,
    name: "Dr. James Rodriguez",
    role: "Clinical Psychologist",
    tags: "Trauma & Grief Counseling",
    experience: "8 years",
    reviews: 198,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?crop=entropy&cs=tinysrgb&fit=max&w=800&q=80"
  },
  {
    id: 6,
    name: "Dr. David Kumar",
    role: "Psychiatrist",
    tags: "Bipolar & Schizophrenia",
    experience: "13 years",
    reviews: 203,
    rating: 4.7,
    img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export default function TherapistList() {
  const navigate = useNavigate();

  return (
    <div className="therapist-page">

      <h2 className="page-title text-center">Find Your Therapist</h2>
      <p className="page-subtitle text-center">
        Browse our network of licensed mental health professionals
      </p>

      <div className="search-bar">
        <input
          className="form-control search-input"
          placeholder="Search therapist..."
        />
        <button className="btn filter-btn">
          Filters
        </button>
      </div>

      <div className="container-fluid">
        <div className="row row-cols-3 g-4">
          {therapists.map((t) => (
            <div className="col" key={t.id}>
              <div className="therapist-card">
                <div className="img-wrapper">
                  <img src={t.img} alt={t.name} />
                  <span className="rating-badge">⭐ {t.rating}</span>
                </div>

                <div className="card-body">
                  <h5 className="fw-bold">{t.name}</h5>
                  <p className="small text-muted mb-1">{t.role}</p>
                  <p className="small text-success mb-3">{t.tags}</p>

                  <div className="d-flex justify-content-between small text-muted mb-3">
                    <span>
                      <strong>Experience</strong><br />
                      {t.experience}
                    </span>
                    <span className="text-end">
                      <strong>Reviews</strong><br />
                      {t.reviews}
                    </span>
                  </div>

                  {/*  علشان اما هنا تعملها ربط بصفحة الدكتور */}
                  <button 
                    className="btn btn-main w-100 mb-2"
                    onClick={() => window.open("/doctor-profile")}
                  >
                    <i className="bi bi-person-fill me-2"></i> View Profile
                  </button>
                  {/* مؤقتا عقبال ما نعمل start chat  */}
                  <button className="btn btn-outline-main w-100"
                   onClick={() => window.open("/doctor-profile")}
                  >
                    <i className="bi bi-chat-dots-fill me-2"></i> Start Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
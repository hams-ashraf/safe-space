import React from 'react'
import "./Home.css";
import therapist1 from "../../assets/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg";
import therapist2 from "../../assets/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg";
import therapist3 from "../../assets/handsome-young-cheerful-man-with-arms-crossed_171337-1073.avif";

export default function Home() {
  return (
    <>
    {/* Section 1: Hero */}
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
      <a href="#get-started" className="custom-button">
  <i className="fa-solid fa-user-doctor"></i> Find a Therapist
</a>

<a href="#ai-support" className="custom-button">
  <i className="fa-solid fa-robot"></i> Chat with AI
</a>

    </div>
  </div>
</section>

{/* Section 2: Top Rated Therapists */}
<section id="doctors" className="section-bg py-5">
  <div className="container">
  <h2 className="text-center fw-bold mb-5" style={{color:"#41655d"}}>Top Rated Therapists</h2> 
     <div className="row g-4">
      <div className="col-md-4">
        <div className="card shadow-sm text-center">
          <img src={therapist2} className="card-img-top" alt="Doctor"/>
          <div className="card-body">
            <h5 className="card-title">Dr. Sarah</h5>
            <p className="card-text ">Licensed Therapist</p>
            <div className="text-warning">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-regular fa-star"></i>
            </div>
            <a href="#" className="btn btn-custom mt-3">Book Session</a>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm text-center">
          <img src={therapist1} className="card-img-top" alt="Doctor"/>
          <div className="card-body">
            <h5 className="card-title">Dr. Ahmed</h5>
            <p className="card-text ">Licensed Therapist</p>
            <div className="text-warning">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-regular fa-star"></i>
            </div>
            <a href="#" className="btn btn-custom mt-3">Book Session</a>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm text-center">
          <img src={therapist3} className="card-img-top" alt="Doctor"/>
          <div className="card-body">
            <h5 className="card-title">Dr. Mona</h5>
            <p className="card-text">Licensed Therapist</p>
            <div className="text-warning">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-regular fa-star"></i>
            </div>
            <a href="#" className="btn btn-custom mt-3">Book Session</a>
          </div>
        </div>
      </div>
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

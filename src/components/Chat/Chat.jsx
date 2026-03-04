import React from "react";
import therapist1 from "../../assets/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg";
import therapist2 from "../../assets/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg";
import therapist3 from "../../assets/handsome-young-cheerful-man-with-arms-crossed_171337-1073.avif";
import "./Chat.css"

export default function Chat() {
  return (
    
    <div className="chat-page container mt-4">

      <div className="top-options mb-4 d-flex gap-2">
  <button className="btn btn-custom active">Top Doctors</button>
  <button className="btn btn-custom">Start New Chat</button>
</div>


      <div className="doctors-list row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <img src={therapist3} className="card-img-top rounded mx-auto mt-3" alt="Doctor"/>
            <div className="card-body">
              <h5 className="card-title">Dr.Sarah</h5>
              <p className="card-text text-muted">Clinical Psychologist</p>
              <a href="#" className="btn btn-success">Send Message</a>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <img src={therapist1} className="card-img-top rounded mx-auto mt-3"  alt="Doctor"/>
            <div className="card-body">
              <h5 className="card-title">Dr.Ahmed</h5>
              <p className="card-text text-muted">Licensed Therapist</p>
              <a href="#" className="btn btn-success">Send Message</a>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm text-center">
            <img src={therapist2} className="card-img-top rounded mx-auto mt-3"  alt="Doctor"/>
            <div className="card-body">
              <h5 className="card-title">Dr.Mona</h5>
              <p className="card-text text-muted">Psychologist</p>
              <a href="#" className="btn btn-success">Send Message</a>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-box border rounded shadow-sm d-flex flex-column" >   
        <div className="messages flex-grow-1 p-3 overflow-auto">
          <div className="message mb-2 " style={{textAlign:"left"}}>
            <div className="p-2 bg-white rounded shadow-sm d-inline-block">Hello, how can I help you?</div>
          </div>
          <div className="message mb-2" style={{textAlign:"right"}}>
            <div className="p-2 text-white rounded shadow-sm d-inline-block"  style={{ backgroundColor: "#41655d" }}>Hi, I want to start therapy.</div>
          </div>
          <div className="message mb-2" style={{textAlign:"left"}}>
            <div className="p-2 bg-white rounded shadow-sm d-inline-block">Sure! Let's schedule a session.</div>
          </div>
        </div>

        <div className="input-group p-3 border-top">
          <input type="text" className="form-control" placeholder="Type a message..." />
          <button className="btn text-white"  style={{ backgroundColor: "#41655d" }}>Send</button>
        </div>
      </div>
    </div>
  );
}

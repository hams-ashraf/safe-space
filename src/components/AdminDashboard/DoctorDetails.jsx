import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doctorsData } from "../Shared/adminDummyData";
import { getDoctorDetails } from "../../api/dashboard";
import "./DoctorDetails.css";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

const defaultImage =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="#e9f3ef"/><circle cx="90" cy="70" r="28" fill="#bdd6cf"/><ellipse cx="90" cy="138" rx="48" ry="34" fill="#bdd6cf"/></svg>`
  );

export default function DoctorDetails() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchDoctor = async () => {
    try {
      setLoading(true);

      const data = await getDoctorDetails(id);
      setDoctor(data);

    } catch (error) {
      console.log("Error:", error);
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  fetchDoctor();
}, [id]);


  if (loading || !doctor) {
  return <p>Loading...</p>;
}

const imageUrl = doctor.profileImageUrl
  ? `http://doctorprofile.runasp.net${doctor.profileImageUrl}`
  : defaultImage; 

  if (loading) {
    return (
      <div className="doctor-details-card">
        <p>Loading doctor...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-details-card">
        <p>Doctor not found.</p>
        <Link className="admin-btn admin-btn-secondary" to="/doctors">
          Back
        </Link>
      </div>
    );
  }
  async function handleDelete(id) {
  try {
    await deleteDoctor(id);

    setDoctors(prev => prev.filter(d => d.id !== id));
  } catch (error) {
    console.log(error);
    alert("Delete failed");
  }
}
const groupSlots = doctor.availableSlots?.filter(
  (slot) => slot.type === "Group"
);

const oneToOneSlots = doctor.availableSlots?.filter(
  (slot) => slot.type === "OneToOne"
);
  return (
    <div className="doctor-details-card">
      <div className="doctor-details-head">
        <h3>Doctor Details</h3>
        <Link className="admin-btn admin-btn-secondary" to="/admin/doctors">
          Back
        </Link>
      </div>

      <div className="doctor-details-grid">
        <img
  src={imageUrl}
  alt={doctor.fullName}
  className="doctor-details-image"
/>

        <div className="doctor-details-info">
          <p><strong>Name:</strong> {doctor.fullName || doctor.name}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Position:</strong> {doctor.position}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Years of Experience:</strong> {doctor.yearOfExperience}</p>
          <p><strong>Rating:</strong> {doctor.averageRating}</p>
          {/* <p><strong>Reviews Number:</strong> {doctor.reviewsCount}</p> */}
          <p><strong>About:</strong> {doctor.about}</p>
          <p><strong>Therapy Approach:</strong> {doctor.therapyApproach}</p>
          <p><strong>Certificates:</strong></p>
          <ul>
            {doctor.certifications?.map((cert) => (
              <li key={cert.id}>{cert.title}</li>
            ))}
          </ul>
          {/* <p><strong>Client Reviews:</strong> {doctor.clientReviews}</p> */}
          <p><strong>Available Slots:</strong></p>
          <div className="slots-container">
              <div>
                <h4>One to One</h4>
                <div className="slots-grid">
                  {oneToOneSlots?.map((slot) => (
                    <div key={slot.id} className="slot-card">
                      <p><FaCalendarAlt className="icon" /> {slot.date}</p>
                      <p> <FaClock className="icon" /> {slot.time}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4>Group</h4>
                <div className="slots-grid">
                  {groupSlots?.map((slot) => (
                    <div key={slot.id} className="slot-card">
                      <p><FaClock className="icon" /> {slot.time}</p>
                      <p> <FaClock className="icon" /> {slot.time}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          {/* <p><strong>Password:</strong> {doctor.password}</p> */}
        </div>
      </div>
    </div>
  );
}
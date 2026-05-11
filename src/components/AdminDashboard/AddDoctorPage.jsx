import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoctor } from "../../api/dashboard";
import "./AddDoctorPage.css";

export default function AddDoctorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    specialization: "",
    position: "",
    yearOfExperience: "",
    bio: "",
    aboutSession: "",
    therapyApproach: "",

    phone: "",
    rating: "",
    reviewsNumber: "",
    certificates: "",
    clientReviews: "",
    status: "Active",
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      
      await addDoctor({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        specialization: form.specialization,
        position: form.position,
        yearOfExperience: Number(form.yearOfExperience),
        bio: form.bio,
        aboutSession: form.aboutSession,
        therapyApproach: form.therapyApproach,
      });

      alert("Doctor added successfully");
      navigate("/admin/doctors");

    } catch (error) {
      console.log(error);
      alert("Failed to add doctor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="edit-doctor-card add-doctor-page">
      <div className="edit-doctor-head">
        <h3>Add Doctor</h3>
      </div>

      <form className="edit-doctor-form" onSubmit={onSubmit}>

        <input className="edit-input" name="fullName" value={form.fullName} onChange={onChange} placeholder="Full Name" />
        <input className="edit-input" name="email" value={form.email} onChange={onChange} placeholder="Email" />
        <input className="edit-input" name="password" value={form.password} onChange={onChange} placeholder="Password" />
        <input className="edit-input" name="position" value={form.position} onChange={onChange} placeholder="Position" />

        <input className="edit-input" name="specialization" value={form.specialization} onChange={onChange} placeholder="Specialization" />

        <input className="edit-input" name="yearOfExperience" value={form.yearOfExperience} onChange={onChange} placeholder="Years of Experience" />

        <input className="edit-input" name="bio" value={form.bio} onChange={onChange} placeholder="Bio" />

        <input className="edit-input" name="aboutSession" value={form.aboutSession} onChange={onChange} placeholder="About Session" />

        <textarea className="edit-input edit-textarea" name="therapyApproach" value={form.therapyApproach} onChange={onChange} placeholder="Therapy Approach" />

{/*         
        <input className="edit-input" name="phone" value={form.phone} onChange={onChange} placeholder="Phone" />
        <input className="edit-input" name="rating" value={form.rating} onChange={onChange} placeholder="Rating" />
        <input className="edit-input" name="reviewsNumber" value={form.reviewsNumber} onChange={onChange} placeholder="Reviews Number" /> */}

        <textarea className="edit-input edit-textarea" name="certificates" value={form.certificates} onChange={onChange} placeholder="Certificates" />
        {/* <textarea className="edit-input edit-textarea" name="clientReviews" value={form.clientReviews} onChange={onChange} placeholder="Client Reviews" /> */}

        <select className="edit-input" name="status" value={form.status} onChange={onChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="edit-doctor-actions">
          <button className="admin-btn admin-btn-primary" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Doctor"}
          </button>
        </div>

      </form>
    </div>
  );
}
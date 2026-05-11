import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doctorsData } from "../Shared/adminDummyData";
import { getAllDoctors, updateDoctor } from "../../api/dashboard";
import "./EditDoctor.css";


export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [slot, setSlot] = useState({ date: "", time: "" });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);

        const data = await getAllDoctors();

        let foundDoctor = data?.find((d) => String(d.id) === id);

        if (!foundDoctor) {
          foundDoctor = doctorsData.find((d) => String(d.id) === id);
        }

        setForm(foundDoctor || null);
      } catch (error) {
        console.log("Error loading doctor:", error);

        const fallback = doctorsData.find((d) => String(d.id) === id);
        setForm(fallback || null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  function addSlot() {
  setForm((prev) => ({
    ...prev,
    availableSlots: [
      ...(prev.availableSlots || []),
      slot
    ]
  }));

  setSlot({ date: "", time: "" });
} 
  function onChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
  fullName: form.fullName || form.name,
  position: form.position,
  specialization: form.specialization,
  yearOfExperience: Number(form.yearOfExperience || form.yearsOfExperience || 0),
  about: form.about,
  aboutSession: form.aboutSession || "",
  therapyApproach: form.therapyApproach,
  

  availableSlots: (form.availableSlots || []).length > 0
  ? form.availableSlots.map(s => ({
      date: new Date(s.date).toISOString(),
      time: s.time
    }))
  : undefined
  
};
 console.log("ID:", id);
console.log("PAYLOAD:", payload);
      await updateDoctor(id, payload);

      alert("Doctor updated successfully ");
      navigate("/admin/doctors");

    } catch (error) {
      console.log("Update error:", error);
      alert("Failed to update doctor ");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="edit-doctor-card">
        <p>Loading doctor...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="edit-doctor-card">
        <p>Doctor not found</p>
        <Link className="admin-btn admin-btn-secondary" to="/doctors">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="edit-doctor-card">
      <div className="edit-doctor-head">
        <h3>Edit Doctor</h3>
      </div>

      <form className="edit-doctor-form" onSubmit={onSubmit}>

        <input
          className="edit-input"
          name="fullName"
          value={form.fullName || form.name || ""}
          onChange={onChange}
          placeholder="Full Name"
        />

        <input
          className="edit-input"
          name="email"
          value={form.email || ""}
          onChange={onChange}
          placeholder="Email"
        />

        <input
          className="edit-input"
          name="position"
          value={form.position || ""}
          onChange={onChange}
          placeholder="Position"
        />

        <input
          className="edit-input"
          name="specialization"
          value={form.specialization || ""}
          onChange={onChange}
          placeholder="Specialization"
        />

        <input
          className="edit-input"
          name="yearOfExperience"
          value={form.yearOfExperience || form.yearsOfExperience || ""}
          onChange={onChange}
          placeholder="Years of Experience"
        />

        <input
          className="edit-input"
          name="aboutSession"
          value={form.aboutSession || ""}
          onChange={onChange}
          placeholder="About Session"
        />

        <textarea
          className="edit-input edit-textarea"
          name="about"
          value={form.about || ""}
          onChange={onChange}
          placeholder="About"
        />

        <textarea
          className="edit-input edit-textarea"
          name="therapyApproach"
          value={form.therapyApproach || ""}
          onChange={onChange}
          placeholder="Therapy Approach"
        />

        {/* <textarea
          className="edit-input edit-textarea"
          name="availableSlots"
          value={JSON.stringify(form.availableSlots || [])}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              availableSlots: JSON.parse(e.target.value || "[]"),
            }))
          }
          placeholder='Available Slots (JSON)'
        /> */}

        <div className="edit-doctor-actions">
          <button className="admin-btn admin-btn-primary" type="submit">
            Save Changes
          </button>

          <Link className="admin-btn admin-btn-secondary" to="/admin/doctors">
            Cancel
          </Link>
        </div>

      </form>
    </div>
  );
}
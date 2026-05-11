import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "../editProfile/editProfile.css";
import "./EditProfileDoctor.css";

const defaultAvatar =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect fill="#e8eeeb" width="160" height="160"/><circle cx="80" cy="64" r="28" fill="#b8cfc6"/><ellipse cx="80" cy="128" rx="48" ry="36" fill="#b8cfc6"/></svg>`
  );

function getFirstNewPasswordRuleError(password) {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must include a number";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include an uppercase letter";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include a special character";
  }
  return null;
}

export default function EditProfileDoctor() {
  const fileInputRef = useRef(null);
  const doctorId = localStorage.getItem("doctorId");
  const [doctor, setDoctor] = useState(null);
  const [image, setImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordStarted, setNewPasswordStarted] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const newPasswordRuleError =
    newPasswordStarted && newPassword.length > 0
      ? getFirstNewPasswordRuleError(newPassword)
      : null;

useEffect(() => {
  const fetchDoctor = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/DoctorDashboard/MyProfile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.log("API failed:", res.status);
        return;
      }

      const data = await res.json();

      setDoctor(data);
      setAvatarPreview(data.imageUrl || defaultAvatar);

    } catch (err) {
      console.error(err);
    }
  };

  fetchDoctor();
}, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleNewPasswordChange = (e) => {
    setNewPasswordStarted(true);
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const isPasswordChangeAttempt =
      currentPassword.trim() !== "" ||
      newPassword.trim() !== "" ||
      confirmPassword.trim() !== "";

    if (isPasswordChangeAttempt) {
      if (!currentPassword) {
        setFormError("Enter current password");
        return;
      }

      if (newPassword.length < 8) {
        setFormError("Password must be at least 8 characters");
        return;
      }

      if (newPassword !== confirmPassword) {
        setFormError("Passwords do not match");
        return;
      }

      const ruleErr = getFirstNewPasswordRuleError(newPassword);
      if (ruleErr) {
        setFormError(ruleErr);
        return;
      }
    }

    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      if (image) {
  const formData = new FormData();
  formData.append("image", image);

  const token = localStorage.getItem("token");

const res = await fetch("/api/DoctorDashboard/UpdateProfile", {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

  if (!res.ok) {
    throw new Error("Failed to update profile image");
  }

  const updatedDoctor = await res.json();

  setDoctor(updatedDoctor);
  setAvatarPreview(updatedDoctor.imageUrl || defaultAvatar);
}
        if (isPasswordChangeAttempt) {
  const token = localStorage.getItem("token");

await fetch("/api/DoctorDashboard/UpdatePassword", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    currentPassword,
    newPassword,
    confirmNewPassword: confirmPassword,
  }),
});
}
      setFormSuccess("Profile updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setSaving(false);
    }
  };

  const openMapModal = () => setMapModalOpen(true);
  const closeMapModal = () => setMapModalOpen(false);

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <header className="edit-profile-header">
          <h1 className="edit-profile-title">Edit profile</h1>
          <p className="edit-profile-subtitle">
            Update your details and optional password below.
          </p>
        </header>

        <form className="edit-profile-form" onSubmit={handleSubmit} noValidate>
          <section
            className="edit-profile-section"
            aria-labelledby="edit-profile-doctor-photo-heading"
          >
            <h2
              id="edit-profile-doctor-photo-heading"
              className="edit-profile-section-title"
            >
              Profile photo
            </h2>
            <div className="edit-profile-photo-row">
              <div className="edit-profile-avatar-wrap">
               <img
   src={avatarPreview || doctor?.imageUrl || defaultAvatar}
  alt="doctor"
  className="profile-img"
/>
              </div>
              <div className="edit-profile-photo-actions">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                    />
                <button
                  type="button"
                  className="edit-profile-upload-btn"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  aria-label="Upload profile image"
                >
                  <span className="edit-profile-upload-icon" aria-hidden="true">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 16V4M12 4L8 8M12 4L16 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Upload image
                </button>
                <p className="edit-profile-hint">PNG or JPG, shown locally only.</p>
              </div>
            </div>
          </section>

          <section
            className="edit-profile-section"
            aria-labelledby="edit-profile-doctor-details-heading"
          >
            <h2
              id="edit-profile-doctor-details-heading"
              className="edit-profile-section-title"
            >
              Account details
            </h2>

            <label className="edit-profile-field">
              <span className="edit-profile-label">Email</span>
              <input type="email"
               className="edit-profile-input edit-profile-input-disabled"
                value={doctor?.email || ""}
                disabled 
                readOnly 
                aria-disabled="true" />
              <span className="edit-profile-hint">
                Email cannot be changed from this screen.
              </span>
            </label>
          </section>
          <section
            className="edit-profile-section edit-profile-section-password"
            aria-labelledby="edit-profile-doctor-password-heading"
          >
            <h2
              id="edit-profile-doctor-password-heading"
              className="edit-profile-section-title"
            >
              Update password
            </h2>
            <p className="edit-profile-muted">
              Leave all fields empty to keep your current password.
            </p>

            <label className="edit-profile-field">
              <span className="edit-profile-label">Current password</span>
              <input
                type="password"
                className="edit-profile-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="off"
                placeholder="Current Password"
              />
            </label>

            <label className="edit-profile-field">
              <span className="edit-profile-label">New password</span>
              <input
                type="password"
                className="edit-profile-input"
                value={newPassword}
                onChange={handleNewPasswordChange}
                autoComplete="new-password"
                placeholder="New Password"
              />
              {newPasswordRuleError && (
                <p className="edit-profile-password-rule-msg" role="alert">
                  {newPasswordRuleError}
                </p>
              )}
            </label>

            <label className="edit-profile-field">
              <span className="edit-profile-label">Confirm new password</span>
              <input
                type="password"
                className="edit-profile-input mb-4"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm New Password"
              />
            </label>
            {newPassword.length > 0 &&
              confirmPassword.length > 0 &&
              newPassword !== confirmPassword && (
                <p className="edit-profile-inline-error" role="alert">
                  Passwords do not match.
                </p>
              )}
          </section>

          {formError && (
            <p
              className="edit-profile-banner edit-profile-banner-error"
              role="alert"
            >
              {formError}
            </p>
          )}
          {formSuccess && (
            <p
              className="edit-profile-banner edit-profile-banner-success"
              role="status"
            >
              {formSuccess}
            </p>
          )}

          <div className="edit-profile-actions">
            <button
              type="submit"
              className="edit-profile-save-btn"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

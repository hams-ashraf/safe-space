import React, { useEffect, useRef, useState } from "react";
import "./editProfile.css";
import {
  getMyProfile,
  updateMyProfile,
  updatePassword,
} from "../../api/patientApi";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
function LocationPicker({ setLocation, close }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      close();
    },
  });

  return null;
}

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

function isNewPasswordValid(password) {
  return getFirstNewPasswordRuleError(password) === null;
}

export default function EditProfile() {
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordStarted, setNewPasswordStarted] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getMyProfile();
      const user = res.data;
    setAvatarPreview(user.imageUrl || defaultAvatar);
      setFullName(user.fullName || "");
      setDisplayName(user.displayName || user.fullName || "");
      setEmail(user.email || "");
      setLocation(user.location || "");
      setPhone(user.phoneNumber || "");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const newPasswordRuleError =
    newPasswordStarted && newPassword.length > 0
      ? getFirstNewPasswordRuleError(newPassword)
      : null;

  const passwordSectionTouched =
    currentPassword.length > 0 ||
    newPassword.length > 0 ||
    confirmPassword.length > 0;

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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

  try {
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

      await updatePassword({
        CurrentPassword: currentPassword,
        NewPassword: newPassword,
        ConfirmNewPassword: confirmPassword,
      });
    }
    const formData = new FormData();

    formData.append("FullName", fullName);
    formData.append("DisplayName", displayName || fullName);
    formData.append("PhoneNumber", phone);
    formData.append("Location", location);
    if (image) {
        formData.append("Image", image);
        }

    await updateMyProfile(formData);

    console.log("Profile updated successfully");

    const updated = await getMyProfile();

    console.log("IMAGE URL FROM BACKEND:", updated.data.imageUrl);
          console.log("PROFILE AFTER LOGIN:", res.data);

    setAvatarPreview(updated.data.imageUrl || defaultAvatar);
    setFullName(updated.data.fullName || "");
    setDisplayName(updated.data.displayName || "");
    setPhone(updated.data.phoneNumber || "");
    setLocation(updated.data.location || "");
    
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setFormSuccess("Profile updated successfully");

  } catch (err) {
    setFormError("Something went wrong");
  }
};

  const openMapModal = () => setMapModalOpen(true);
  const closeMapModal = () => setMapModalOpen(false);

  const pickLocation = (latlng) => {
  setLocation(latlng);
  setMapModalOpen(false);
};

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
          <section className="edit-profile-section" aria-labelledby="edit-profile-photo-heading">
            <h2 id="edit-profile-photo-heading" className="edit-profile-section-title">
              Profile photo
            </h2>
            <div className="edit-profile-photo-row">
              <div className="edit-profile-avatar-wrap">
                <img
                  src={avatarPreview}
                  alt="Profile preview"
                  className="edit-profile-avatar"
                />
              </div>
              <div className="edit-profile-photo-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="edit-profile-file-input"
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  className="edit-profile-upload-btn"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  aria-label="Upload profile image"
                >
                  <span className="edit-profile-upload-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          <section className="edit-profile-section" aria-labelledby="edit-profile-details-heading">
            <h2 id="edit-profile-details-heading" className="edit-profile-section-title">
              Account details
            </h2>

            <label className="edit-profile-field">
              <span className="edit-profile-label">Full name</span>
              <input
                type="text"
                className="edit-profile-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="edit-profile-field">
              <span className="edit-profile-label">Display name</span>
              <input
                type="text"
                className="edit-profile-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="nickname"
              />
            </label>

            <label className="edit-profile-field">
              <span className="edit-profile-label">Phone</span>
              <input
                type="tel"
                className="edit-profile-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="N/A"
              />
            </label>

            <label className="edit-profile-field">
              <span className="edit-profile-label">Email</span>
              <input
                type="email"
                className="edit-profile-input edit-profile-input-disabled"
                value={email}
                disabled
                readOnly
                aria-disabled="true"
              />
              <span className="edit-profile-hint">Email cannot be changed from this screen.</span>
            </label>

            <label className="edit-profile-field">
              <span className="edit-profile-label">Location</span>
              <div className="edit-profile-input-trailing-wrap">
                <input
                  type="text"
                  className="edit-profile-input edit-profile-input-trailing"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  autoComplete="address-level2"
                  placeholder="Not set"
                />
                <button
                  type="button"
                  className="edit-profile-inline-icon-btn"
                  onClick={openMapModal}
                  aria-label="Open map to choose location"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22C14 18 20 15.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4183 10 18 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </label>
          </section>

          <section className="edit-profile-section edit-profile-section-password" aria-labelledby="edit-profile-password-heading">
            <h2 id="edit-profile-password-heading" className="edit-profile-section-title">
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
            {newPassword.length > 0 && confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="edit-profile-inline-error" role="alert">
                Passwords do not match.
              </p>
            )}
          </section>

          {formError && (
            <p className="edit-profile-banner edit-profile-banner-error" role="alert">
              {formError}
            </p>
          )}
          {formSuccess && (
            <p className="edit-profile-banner edit-profile-banner-success" role="status">
              {formSuccess}
            </p>
          )}

          <div className="edit-profile-actions">
            <button type="submit" className="edit-profile-save-btn">
              Save changes
            </button>
          </div>
        </form>
      </div>

      {mapModalOpen && (
        <div
          className="edit-profile-modal-backdrop"
          role="presentation"
          onClick={closeMapModal}
        >
          <div
            className="edit-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-map-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="edit-profile-modal-header">
              <h3 id="edit-profile-map-modal-title" className="edit-profile-modal-title">
                Pick a location
              </h3>
              <button
                type="button"
                className="edit-profile-modal-dismiss"
                onClick={closeMapModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="edit-profile-modal-caption">Map preview (demo — no real map)</p>
            <MapContainer
  center={[30.0444, 31.2357]} // Cairo
  zoom={10}
  style={{ height: "300px", width: "100%", borderRadius: "12px" }}
>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

  <LocationPicker
    setLocation={setLocation}
    close={closeMapModal}
  />
</MapContainer>
            <p className="edit-profile-modal-sub">Or choose a preset:</p>
          </div>
        </div>
      )}
    </div>
  );
}

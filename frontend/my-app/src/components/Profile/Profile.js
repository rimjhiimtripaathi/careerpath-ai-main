import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useProfile } from "../../contexts/ProfileContext";
import { userAPI } from "../../services/userService";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const { profile, updateProfile, loading, error } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    date_of_birth: "",
    phone_number: "",
    address: "",
    city: "",
    country: "",
    education_level: "",
    institution: "",
    field_of_study: "",
    graduation_year: "",
    bio: "",
    skills: "",
    interests: "",
    profile_picture: "",
  });
  const [saveStatus, setSaveStatus] = useState("");

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        date_of_birth: profile.date_of_birth || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
        education_level: profile.education_level || "",
        institution: profile.institution || "",
        field_of_study: profile.field_of_study || "",
        graduation_year: profile.graduation_year || "",
        bio: profile.bio || "",
        skills: profile.skills || "",
        interests: profile.interests || "",
        profile_picture: profile.profile_picture || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus("saving");

    // Prepare data for API
    const submitData = { ...formData };

    // Convert empty strings to null for optional fields
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === "") {
        submitData[key] = null;
      }
    });

    const result = await updateProfile(submitData);

    if (result.success) {
      setSaveStatus("success");
      setIsEditing(false);
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus("error");
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        date_of_birth: profile.date_of_birth || "",
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
        education_level: profile.education_level || "",
        institution: profile.institution || "",
        field_of_study: profile.field_of_study || "",
        graduation_year: profile.graduation_year || "",
        bio: profile.bio || "",
        skills: profile.skills || "",
        interests: profile.interests || "",
        profile_picture: profile.profile_picture || "",
      });
    }
    setIsEditing(false);
    setSaveStatus("");
  };

  const educationLevels = [
    "High School",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Other",
  ];

  if (loading && !profile) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your personal and educational information</p>
      </div>

      <div className="profile-content">
        {/* Basic User Info Card */}
        <div className="profile-card">
          <h2>Basic Information</h2>
          <div className="basic-info">
            <div className="info-item">
              <label>Name:</label>
              <span>{user?.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="info-item">
              <label>Member Since:</label>
              <span>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Form Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Profile Details</h2>
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  className="save-btn"
                  onClick={handleSubmit}
                  disabled={saveStatus === "saving"}
                >
                  {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {saveStatus === "success" && (
            <div className="success-message">Profile updated successfully!</div>
          )}
          {saveStatus === "error" && (
            <div className="error-message">
              {error || "Failed to update profile"}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Personal Information */}
              <div className="form-section">
                <h3>Personal Information</h3>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="+91 9876543218"
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Ghaziabad Uttar Pradesh"
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="India"
                    />
                  </div>
                </div>
              </div>

              {/* Educational Information */}
              <div className="form-section">
                <h3>Educational Information</h3>

                <div className="form-group">
                  <label>Education Level</label>
                  <select
                    name="education_level"
                    value={formData.education_level}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select Education Level</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Institution</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="University Name"
                  />
                </div>

                <div className="form-group">
                  <label>Field of Study</label>
                  <input
                    type="text"
                    name="field_of_study"
                    value={formData.field_of_study}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Computer Science, Business, etc."
                  />
                </div>

                <div className="form-group">
                  <label>Graduation Year</label>
                  <input
                    type="number"
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="2024"
                    min="1900"
                    max="2030"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="form-section full-width">
                <h3>Additional Information</h3>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Skills</label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="List your skills (comma-separated)"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Interests</label>
                  <textarea
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="List your interests (comma-separated)"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Profile Picture URL</label>
                  <input
                    type="url"
                    name="profile_picture"
                    value={formData.profile_picture}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

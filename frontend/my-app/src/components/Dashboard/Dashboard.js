import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };

  const navigateToAssessments = () => {
    navigate("/assessments");
  };

  const navigateToTextAnalysis = () => {
    navigate("/text-analysis");
  };
  const navigateToVideoAnalysis = () => {
    navigate("/video-analysis");
  };
  const navigateToResults = () => {
    navigate("/assessment-results");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>EduTech AI Powered Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}!</span>
          <button onClick={navigateToProfile} className="profile-btn">
            My Profile
          </button>
          <button onClick={navigateToAssessments} className="assessment-btn">
            Take Assessment
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="user-card">
          <h2>User Information</h2>
          <div className="user-details">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Client ID:</strong> {user?.client_id}
            </p>
            <p>
              <strong>Consent Given:</strong>{" "}
              {user?.consent_given ? "Yes" : "No"}
            </p>
            <p>
              <strong>Member Since:</strong>{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="dashboard-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button
              className="action-btn primary"
              onClick={navigateToAssessments}
            >
              Take Assessment
            </button>

            <button
              className="action-btn text"
              onClick={navigateToTextAnalysis}
            >
              Text Analysis
            </button>
            <button
              className="action-btn video"
              onClick={navigateToVideoAnalysis}
            >
              Video Analysis
            </button>

            <button className="action-btn profile" onClick={navigateToProfile}>
              View Profile
            </button>
            <button className="action-btn result" onClick={navigateToResults}>
              View Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

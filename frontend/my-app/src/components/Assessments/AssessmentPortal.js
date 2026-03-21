import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssessment } from "../../contexts/AssessmentContext";
import "./AssessmentPortal.css";

const AssessmentPortal = () => {
  const { assessmentTypes, loading, error } = useAssessment();
  const navigate = useNavigate();

  const handleStartAssessment = (assessmentType) => {
    navigate(`/assessment/${assessmentType.id}`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Psychology: "#667eea",
      Career: "#10b981",
      Skills: "#f59e0b",
      default: "#6b7280",
    };
    return colors[category] || colors.default;
  };

  if (loading) {
    return (
      <div className="assessment-portal-loading">Loading assessments...</div>
    );
  }

  if (error) {
    return <div className="assessment-portal-error">{error}</div>;
  }

  return (
    <div className="assessment-portal">
      <div className="assessment-header">
        <h1>Assessment Portal</h1>
        <p>
          Choose an assessment to evaluate your interests, skills, and
          personality traits
        </p>
      </div>

      <div className="assessments-grid">
        {assessmentTypes.map((assessment) => (
          <div
            key={assessment.id}
            className="assessment-card"
            style={{
              borderTop: `4px solid ${getCategoryColor(assessment.category)}`,
            }}
          >
            <div className="assessment-category">{assessment.category}</div>

            <h3>{assessment.name}</h3>
            <p className="assessment-description">{assessment.description}</p>

            <div className="assessment-meta">
              <span className="duration">
                ⏱️ {assessment.duration_minutes} min
              </span>
              <span className="questions">
                ❓ {assessment.questions_count} questions
              </span>
            </div>

            <button
              className="start-assessment-btn"
              onClick={() => handleStartAssessment(assessment)}
              style={{ backgroundColor: getCategoryColor(assessment.category) }}
            >
              Start Assessment
            </button>
          </div>
        ))}
      </div>

      {assessmentTypes.length === 0 && (
        <div className="no-assessments">
          <h3>No assessments available at the moment</h3>
          <p>Please check back later for new assessment opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default AssessmentPortal;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAssessment } from "../../contexts/AssessmentContext";
import "./AssessmentResults.css";

const AssessmentResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { getCompleteSessionResult, analyzeVideo } = useAssessment();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await getCompleteSessionResult(sessionId);
      setResults(response.data);
    } catch (err) {
      setError("Failed to load assessment results");
      console.error("Error loading results:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeVideo = async () => {
    if (!results?.video_analysis?.recording) return;

    setAnalyzing(true);
    try {
      await analyzeVideo(results.video_analysis.recording.id);
      // Reload results to get updated analysis
      await loadResults();
    } catch (err) {
      setError("Failed to analyze video");
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  };

  const renderVideoAnalysis = () => {
    if (!results.video_analysis) {
      return (
        <div className="video-status pending">
          <p>No video recording found for this assessment session.</p>
        </div>
      );
    }

    const { recording, analysis } = results.video_analysis;

    if (recording.processing_status === "pending") {
      return (
        <div className="video-status pending">
          <p>Video recorded but not processed yet.</p>
          <button
            className="analyze-btn"
            onClick={handleAnalyzeVideo}
            disabled={analyzing}
          >
            {analyzing ? "Processing..." : "Process Video Analysis"}
          </button>
        </div>
      );
    }

    if (recording.processing_status === "processing") {
      return (
        <div className="video-status processing">
          <p>Video analysis is in progress. Please wait...</p>
          <div className="loading-spinner"></div>
        </div>
      );
    }

    if (recording.processing_status === "failed") {
      return (
        <div className="video-status failed">
          <p>Video analysis failed. Please try again.</p>
          <button
            className="analyze-btn"
            onClick={handleAnalyzeVideo}
            disabled={analyzing}
          >
            {analyzing ? "Processing..." : "Retry Analysis"}
          </button>
        </div>
      );
    }

    if (recording.processing_status === "completed" && analysis) {
      return (
        <div className="analysis-results">
          {/* Overall Score */}
          <div className="analysis-category">
            <h4>Overall Analysis</h4>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-label">Overall Score</div>
                <div
                  className={`metric-value score ${getScoreColor(
                    analysis.overall_score * 100
                  )}`}
                >
                  {Math.round(analysis.overall_score * 100)}%
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Engagement</div>
                <div
                  className={`metric-value ${getScoreColor(
                    analysis.engagement_level * 100
                  )}`}
                >
                  {Math.round(analysis.engagement_level * 100)}%
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Focus</div>
                <div
                  className={`metric-value ${getScoreColor(
                    analysis.focus_score * 100
                  )}`}
                >
                  {Math.round(analysis.focus_score * 100)}%
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Confidence</div>
                <div
                  className={`metric-value ${getScoreColor(
                    analysis.confidence_level * 100
                  )}`}
                >
                  {Math.round(analysis.confidence_level * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Emotional Analysis */}
          <div className="analysis-category">
            <h4>Emotional & Mood Analysis</h4>
            <div className="emotional-chart">
              {analysis.emotional_analysis &&
                Object.entries(analysis.emotional_analysis).map(
                  ([emotion, value]) => (
                    <div key={emotion} className="emotion-item">
                      <span className="emotion-name">
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </span>
                      <div className="emotion-bar">
                        <div
                          className="emotion-fill"
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                      <span className="emotion-value">
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                  )
                )}
            </div>
            <div className="metrics-grid" style={{ marginTop: "16px" }}>
              <div className="metric-item">
                <div className="metric-label">Mood Score</div>
                <div
                  className={`metric-value ${getScoreColor(
                    analysis.mood_score * 100
                  )}`}
                >
                  {Math.round(analysis.mood_score * 100)}%
                </div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Dominant Emotion</div>
                <div className="metric-value">{analysis.dominant_emotion}</div>
              </div>
            </div>
          </div>

          {/* Personality Insights */}
          <div className="analysis-category">
            <h4>Personality & Psychological Traits</h4>
            <div className="emotional-chart">
              {analysis.personality_insights &&
                Object.entries(analysis.personality_insights).map(
                  ([trait, value]) => (
                    <div key={trait} className="emotion-item">
                      <span className="emotion-name">
                        {trait.charAt(0).toUpperCase() + trait.slice(1)}
                      </span>
                      <div className="emotion-bar">
                        <div
                          className="emotion-fill"
                          style={{ width: `${value * 100}%` }}
                        ></div>
                      </div>
                      <span className="emotion-value">
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                  )
                )}
            </div>
          </div>

          {/* Cognitive Analysis */}
          <div className="analysis-category">
            <h4>Cognitive & Analytical Dimensions</h4>
            <div className="metrics-grid">
              {analysis.cognitive_analysis &&
                Object.entries(analysis.cognitive_analysis).map(
                  ([dimension, value]) => (
                    <div key={dimension} className="metric-item">
                      <div className="metric-label">
                        {dimension
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </div>
                      <div className="metric-value">
                        {typeof value === "number"
                          ? Math.round(value * 100) + "%"
                          : value}
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>

          {/* Remarks */}
          {analysis.analysis_remarks && (
            <div className="analysis-category">
              <h4>Analysis Remarks</h4>
              <p style={{ margin: 0, color: "#6b7280", lineHeight: "1.5" }}>
                {analysis.analysis_remarks}
              </p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return <div className="results-loading">Loading assessment results...</div>;
  }

  if (error) {
    return <div className="results-error">{error}</div>;
  }

  if (!results) {
    return (
      <div className="results-error">No results found for this session.</div>
    );
  }

  const { session, assessment_type } = results;

  return (
    <div className="assessment-results">
      <div className="results-header">
        <h1>Assessment Results</h1>
        <p>
          {assessment_type.name} - Completed on{" "}
          {new Date(session.completed_at).toLocaleDateString()}
        </p>
      </div>

      <div className="results-content">
        {/* Session Summary */}
        <div className="results-card">
          <h2>Session Summary</h2>
          <div className="session-summary">
            <div className="summary-item">
              <span className="summary-value">{session.total_score || 0}</span>
              <span className="summary-label">Total Score</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">{session.max_score || 0}</span>
              <span className="summary-label">Max Score</span>
            </div>
            <div className="summary-item">
              <span
                className="summary-value"
                style={{
                  color:
                    session.percentage >= 80
                      ? "#10b981"
                      : session.percentage >= 60
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                {session.percentage ? Math.round(session.percentage) : 0}%
              </span>
              <span className="summary-label">Percentage</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">
                {session.time_taken_seconds
                  ? Math.floor(session.time_taken_seconds / 60)
                  : 0}
                m
              </span>
              <span className="summary-label">Time Taken</span>
            </div>
          </div>

          <div className="score-display">
            <div
              className="score-circle"
              style={{ "--score-percentage": `${session.percentage || 0}%` }}
            >
              <span className="score-text">
                {session.percentage ? Math.round(session.percentage) : 0}%
              </span>
            </div>
            <div className="score-label">Overall Performance</div>
          </div>
        </div>

        {/* Video Analysis */}
        <div className="results-card">
          <h2>Video Behavior Analysis</h2>
          {renderVideoAnalysis()}
        </div>

        {/* Action Buttons */}
        <div className="results-card full-width">
          <div className="results-actions">
            <Link to="/assessments" className="action-btn primary-btn">
              Take Another Assessment
            </Link>
            <Link to="/dashboard" className="action-btn secondary-btn">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;

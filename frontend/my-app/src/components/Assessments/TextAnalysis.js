// frontend/src/pages/analysis/TextAnalysis.js
import React, { useState, useRef, useEffect } from "react";
import {
  analyzeTextEmotion,
  getUserSessions,
  getSessionDetails,
  exportTextAnalysisResults,
} from "../../services/textServices";
import "./TextAnalysis.css";

/**
 * INSTRUCTIONS:
 * 1. Enter text in the input area (minimum 10 characters required)
 * 2. Click "Analyze Text" to process the text for emotion detection
 * 3. View detailed emotion breakdown with confidence scores
 * 4. Use sample texts for quick testing
 * 5. Review session reports with graphical analytics
 * 6. Export results or view different chart visualizations
 *
 * Text analysis page for emotion detection from written text
 */

const TextAnalysis = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [userSessions, setUserSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [chartType, setChartType] = useState("bar"); // "bar" or "pie"
  const [sessionChartType, setSessionChartType] = useState("bar"); // "bar" or "pie"
  const [topEmotionsChartType, setTopEmotionsChartType] = useState("bar"); // "bar" or "pie"
  const [userId] = useState("current_user");

  const textAreaRef = useRef(null);

  // Generate session ID when component mounts
  useEffect(() => {
    setCurrentSessionId(`session_${Date.now()}`);
    loadUserSessions();
  }, []);

  /**
   * Load user sessions with date-wise grouping
   */
  const loadUserSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const sessionsData = await getUserSessions(userId);
      const limitedSessions = sessionsData.sessions?.slice(0, 15) || []; // Limit to latest 15 sessions
      setUserSessions(limitedSessions);

      // Load latest session details by default
      if (limitedSessions.length > 0) {
        const latestSession = limitedSessions[0];
        await loadSessionDetails(
          latestSession.session_date,
          latestSession.session_id,
          0
        );
      } else {
        // Reset states if no sessions
        setSessionDetails(null);
        setSelectedSession(null);
      }
    } catch (err) {
      console.error("Failed to load user sessions:", err);
      setError("Failed to load session history: " + err.message);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  /**
   * Load detailed analysis for a specific session
   */
  const loadSessionDetails = async (
    sessionDate,
    sessionId = null,
    index = 0
  ) => {
    try {
      const details = await getSessionDetails(userId, sessionDate, sessionId);
      setSessionDetails(details);
      setSelectedSession({ sessionDate, sessionId });
      setCurrentSessionIndex(index);
    } catch (err) {
      console.error("Failed to load session details:", err);
      setError("Failed to load session details: " + err.message);
    }
  };

  /**
   * Navigate to previous session
   */
  const goToPreviousSession = () => {
    if (currentSessionIndex < userSessions.length - 1) {
      const newIndex = currentSessionIndex + 1;
      const session = userSessions[newIndex];
      loadSessionDetails(session.session_date, session.session_id, newIndex);
    }
  };

  /**
   * Navigate to next session
   */
  const goToNextSession = () => {
    if (currentSessionIndex > 0) {
      const newIndex = currentSessionIndex - 1;
      const session = userSessions[newIndex];
      loadSessionDetails(session.session_date, session.session_id, newIndex);
    }
  };

  /**
   * Analyze text emotion using AI service
   */
  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    if (text.length < 10) {
      setError("Please enter at least 10 characters for meaningful analysis");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const analysisResults = await analyzeTextEmotion(
        text,
        userId,
        currentSessionId
      );
      setResults(analysisResults);

      // Refresh sessions and load current session details
      await loadUserSessions();
    } catch (err) {
      setError(
        "Analysis failed: " + (err.message || "Please check your connection")
      );
      console.error("Text analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Handle sample text selection
   */
  const handleSampleText = (sampleText) => {
    setText(sampleText);
    setError("");
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  /**
   * Clear current analysis
   */
  const clearAnalysis = () => {
    setText("");
    setResults(null);
    setError("");
  };

  /**
   * Export analysis results
   */
  const exportResults = async () => {
    if (!results) return;

    try {
      const exportData = await exportTextAnalysisResults(userId, "json");

      // Create and trigger download
      const dataStr = JSON.stringify(exportData.content, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        exportData.filename ||
        `text-emotion-analysis-${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Export failed: " + err.message);
    }
  };

  // Sample texts for quick testing
  const sampleTexts = [
    {
      title: "Happy Moment",
      text: "I'm absolutely thrilled about the wonderful news! Today has been absolutely amazing and I feel so grateful for everything that's happening in my life.",
      emotion: "happy",
    },
    {
      title: "Sad Story",
      text: "I've been feeling really down lately. Everything seems so heavy and it's hard to find the motivation to do anything. The world feels gray.",
      emotion: "sad",
    },
    {
      title: "Angry Complaint",
      text: "I'm absolutely furious about this terrible service! How can they treat customers this way? This is completely unacceptable!",
      emotion: "angry",
    },
    {
      title: "Fearful Experience",
      text: "I'm really scared about what might happen next. The uncertainty is terrifying and I don't know how to prepare for the worst-case scenario.",
      emotion: "fearful",
    },
  ];

  // Emotion icons mapping
  const emotionIcons = {
    happy: "laugh",
    sad: "frown",
    angry: "angry",
    fearful: "eye",
    disgusted: "meh",
    surprised: "smile",
    neutral: "smile",
  };

  const emotionColors = {
    happy: "text-yellow-500 bg-yellow-50",
    sad: "text-blue-500 bg-blue-50",
    angry: "text-red-500 bg-red-50",
    fearful: "text-purple-500 bg-purple-50",
    disgusted: "text-green-500 bg-green-50",
    surprised: "text-orange-500 bg-orange-50",
    neutral: "text-gray-500 bg-gray-50",
  };

  const emotionChartColors = {
    happy: "#fbbf24",
    sad: "#3b82f6",
    angry: "#ef4444",
    fearful: "#8b5cf6",
    disgusted: "#10b981",
    surprised: "#f97316",
    neutral: "#6b7280",
  };

  // Text statistics
  const textStats = {
    wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
    characterCount: text.length,
    sentenceCount: text.trim()
      ? text.split(/[.!?]+/).filter(Boolean).length
      : 0,
  };

  // Chart Components
  const EmotionBarChart = ({ emotions, title }) => {
    const emotionEntries = Object.entries(emotions || {}).sort(
      ([, a], [, b]) => b - a
    );
    const maxValue = Math.max(...Object.values(emotions || {}));

    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 text-center">{title}</h4>
        <div className="flex items-end justify-between space-x-2 h-48">
          {emotionEntries.map(([emotion, score]) => {
            const percentage = (score * 100).toFixed(1);
            const height = maxValue > 0 ? (score / maxValue) * 100 : 0;

            return (
              <div
                key={emotion}
                className="flex flex-col items-center flex-1 space-y-2"
              >
                {/* Confidence value above bar */}
                <div className="text-xs font-medium text-gray-600 h-4 flex items-center justify-center">
                  {percentage}%
                </div>

                {/* Bar container */}
                <div className="relative flex flex-col items-center flex-1 w-full">
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${height}%`,
                      backgroundColor: emotionChartColors[emotion],
                      minHeight: "20px",
                    }}
                  ></div>
                </div>

                {/* Emotion label below bar */}
                <span className="text-xs font-medium capitalize text-gray-700 text-center h-4 flex items-center justify-center">
                  {emotion}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const EmotionPieChart = ({ emotions, title }) => {
    const emotionEntries = Object.entries(emotions || {}).sort(
      ([, a], [, b]) => b - a
    );
    const size = 120;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = 0;

    return (
      <div className="flex flex-col items-center space-y-4">
        <h4 className="font-semibold text-gray-900 text-center">{title}</h4>
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {emotionEntries.map(([emotion, score]) => {
              const percentage = score * 100;
              const strokeDasharray =
                score * circumference + " " + circumference;
              const strokeDashoffset = -currentOffset;
              currentOffset += score * circumference;

              return (
                <circle
                  key={emotion}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={emotionChartColors[emotion]}
                  strokeWidth="10"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {emotionEntries[0]?.[1]
                  ? (emotionEntries[0][1] * 100).toFixed(0) + "%"
                  : "0%"}
              </div>
              <div className="text-xs text-gray-600 capitalize">
                {emotionEntries[0]?.[0] || "neutral"}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {emotionEntries.slice(0, 4).map(([emotion, score]) => (
            <div key={emotion} className="flex items-center space-x-1">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: emotionChartColors[emotion] }}
              ></div>
              <span className="capitalize">{emotion}</span>
              <span className="text-gray-600">{(score * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="text-analysis-container">
      {/* Header */}
      <div className="text-analysis-header">
        <h1 className="text-analysis-title">Text Emotion Analysis</h1>
        <p className="text-analysis-subtitle">
          Analyze emotions from written text using advanced AI
        </p>
      </div>

      {/* Guidelines */}
      <div className="text-analysis-guidelines">
        <div className="guidelines-content">
          <h3 className="guidelines-title">Text Analysis Guidelines</h3>
          <ul className="guidelines-list">
            <li>
              • Write naturally - the AI analyzes vocabulary, tone, and
              emotional cues in your text
            </li>
            <li>
              • Minimum 10 characters required for analysis (100+ characters
              recommended for best results)
            </li>
            <li>
              • The system detects 7 core emotions: Happy, Sad, Angry, Fearful,
              Disgusted, Surprised, and Neutral
            </li>
            <li>
              • Use sample texts for quick testing and to understand how
              different emotions are detected
            </li>
            <li>
              • Longer, more descriptive texts typically yield more accurate
              emotion detection
            </li>
          </ul>
        </div>
      </div>

      <div className="text-analysis-grid">
        {/* Left Column - Input Panel */}
        <div className="text-analysis-input-panel">
          <h2 className="panel-title">Enter Text to Analyze</h2>

          {/* Text Statistics */}
          <div className="text-stats-grid">
            <div className="stat-item">
              <div className="stat-value stat-words">{textStats.wordCount}</div>
              <div className="stat-label">Words</div>
            </div>
            <div className="stat-item">
              <div className="stat-value stat-characters">
                {textStats.characterCount}
              </div>
              <div className="stat-label">Characters</div>
            </div>
            <div className="stat-item">
              <div className="stat-value stat-sentences">
                {textStats.sentenceCount}
              </div>
              <div className="stat-label">Sentences</div>
            </div>
          </div>

          {/* Text Input */}
          <div className="text-input-section">
            <textarea
              ref={textAreaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here to analyze emotions... (Minimum 10 characters)"
              className="text-input-area"
              disabled={isAnalyzing}
            />

            <div className="text-input-actions">
              <div className="character-count">
                {text.length < 10 ? (
                  <span className="character-warning">
                    {10 - text.length} more characters needed
                  </span>
                ) : (
                  <span className="character-ready">Ready for analysis</span>
                )}
              </div>

              <div className="action-buttons">
                <button
                  onClick={clearAnalysis}
                  className="btn-secondary"
                  disabled={isAnalyzing}
                >
                  Clear
                </button>
                <button
                  onClick={analyzeText}
                  disabled={isAnalyzing || text.length < 10}
                  className="btn-primary"
                >
                  {isAnalyzing ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <span className="btn-icon">→</span>
                  )}
                  <span>{isAnalyzing ? "Analyzing..." : "Analyze Text"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sample Texts */}
          <div className="sample-texts-section">
            <h3 className="sample-texts-title">Try Sample Texts</h3>
            <div className="sample-texts-grid">
              {sampleTexts.map((sample, index) => {
                const colorClass = emotionColors[sample.emotion];

                return (
                  <button
                    key={index}
                    onClick={() => handleSampleText(sample.text)}
                    className="sample-text-card"
                  >
                    <div className="sample-text-header">
                      <div
                        className={`sample-emotion-indicator ${colorClass
                          .split(" ")[0]
                          .replace("text-", "bg-")}`}
                      ></div>
                      <span className="sample-text-title">{sample.title}</span>
                    </div>
                    <p className="sample-text-preview">{sample.text}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Right Column - Analysis Results */}
        <div className="text-analysis-results-panel">
          <div className="results-header">
            <h2 className="panel-title">Analysis Results</h2>
            <div className="results-actions">
              {results && (
                <button onClick={exportResults} className="btn-export">
                  <span className="btn-icon">↓</span>
                  <span>Export</span>
                </button>
              )}
              <button
                onClick={loadUserSessions}
                disabled={isLoadingSessions}
                className="btn-refresh"
              >
                <span
                  className={`btn-icon ${isLoadingSessions ? "spinning" : ""}`}
                >
                  ↻
                </span>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="results-content">
            {results ? (
              <>
                <EmotionResults results={results} />

                {/* Emotion Visualization with Chart Selection */}
                <div className="chart-section">
                  <div className="chart-header">
                    <h3 className="chart-title">Emotion Visualization</h3>
                    <div className="chart-type-selector">
                      <button
                        onClick={() => setChartType("bar")}
                        className={`chart-type-btn ${
                          chartType === "bar" ? "active" : ""
                        }`}
                      >
                        <span className="btn-icon">📊</span>
                        <span>Bar</span>
                      </button>
                      <button
                        onClick={() => setChartType("pie")}
                        className={`chart-type-btn ${
                          chartType === "pie" ? "active" : ""
                        }`}
                      >
                        <span className="btn-icon">🥧</span>
                        <span>Pie</span>
                      </button>
                    </div>
                  </div>

                  <div className="chart-container">
                    {chartType === "bar" ? (
                      <EmotionBarChart
                        emotions={results.emotions}
                        title="Current Analysis"
                      />
                    ) : (
                      <EmotionPieChart
                        emotions={results.emotions}
                        title="Current Analysis"
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-results">
                <div className="empty-icon">📄</div>
                <p>Enter text and analyze to see results</p>
                <p className="empty-subtitle">
                  Advanced NLP analysis detects emotional tone
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Reports & Analytics - Bottom Section */}
      <div className="session-reports-panel">
        <div className="session-reports-header">
          <h2 className="panel-title">Session Reports & Analytics</h2>
          <div className="session-controls">
            {/* Session Navigation */}
            {userSessions.length > 1 && (
              <div className="session-navigation">
                <button
                  onClick={goToPreviousSession}
                  disabled={currentSessionIndex >= userSessions.length - 1}
                  className="nav-btn"
                >
                  ←
                </button>
                <span className="session-counter">
                  {currentSessionIndex + 1} of {userSessions.length}
                </span>
                <button
                  onClick={goToNextSession}
                  disabled={currentSessionIndex <= 0}
                  className="nav-btn"
                >
                  →
                </button>
              </div>
            )}
            <div className="session-filter">
              <span className="filter-icon">⚡</span>
              <span className="filter-text">Latest 15 Sessions</span>
            </div>
          </div>
        </div>

        {/* Current Session Display */}
        {sessionDetails ? (
          <div className="session-details">
            {/* Session Header Card */}
            <div className="session-header-card">
              <div className="session-header-content">
                <div>
                  <h3 className="session-title">Session Analysis</h3>
                  <p className="session-date">
                    {new Date(sessionDetails.session_date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div className="session-id">
                  <span className="session-id-icon">📅</span>
                  <span className="session-id-text">
                    Session ID:{" "}
                    {sessionDetails.session_id?.substring(0, 8) || "N/A"}
                  </span>
                </div>
              </div>

              {/* Session Summary Cards */}
              <div className="session-summary-grid">
                <div className="summary-card summary-analyses">
                  <div className="summary-value">
                    {sessionDetails.summary.total_analyses}
                  </div>
                  <div className="summary-label">Total Analyses</div>
                </div>
                <div className="summary-card summary-confidence">
                  <div className="summary-value">
                    {(sessionDetails.summary.average_confidence * 100).toFixed(
                      1
                    )}
                    %
                  </div>
                  <div className="summary-label">Avg Confidence</div>
                </div>
                <div className="summary-card summary-words">
                  <div className="summary-value">
                    {sessionDetails.summary.text_statistics.average_word_count.toFixed(
                      0
                    )}
                  </div>
                  <div className="summary-label">Avg Words</div>
                </div>
                <div className="summary-card summary-dominant">
                  <div className="summary-value capitalize">
                    {Object.entries(
                      sessionDetails.summary.emotion_distribution
                    ).sort(([, a], [, b]) => b - a)[0]?.[0] || "neutral"}
                  </div>
                  <div className="summary-label">Dominant Emotion</div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="session-charts-grid">
              {/* Session Emotion Distribution */}
              <div className="chart-panel">
                <div className="chart-header">
                  <h3 className="chart-title">Session Emotion Distribution</h3>
                  <div className="chart-type-selector">
                    <button
                      onClick={() => setSessionChartType("bar")}
                      className={`chart-type-btn ${
                        sessionChartType === "bar" ? "active" : ""
                      }`}
                    >
                      <span className="btn-icon">📊</span>
                      <span>Bar</span>
                    </button>
                    <button
                      onClick={() => setSessionChartType("pie")}
                      className={`chart-type-btn ${
                        sessionChartType === "pie" ? "active" : ""
                      }`}
                    >
                      <span className="btn-icon">🥧</span>
                      <span>Pie</span>
                    </button>
                  </div>
                </div>

                {sessionChartType === "bar" ? (
                  <EmotionBarChart
                    emotions={Object.fromEntries(
                      Object.entries(
                        sessionDetails.summary.emotion_distribution
                      ).map(([emotion, count]) => [
                        emotion,
                        count / sessionDetails.summary.total_analyses,
                      ])
                    )}
                    title="Session Emotion Distribution"
                  />
                ) : (
                  <EmotionPieChart
                    emotions={Object.fromEntries(
                      Object.entries(
                        sessionDetails.summary.emotion_distribution
                      ).map(([emotion, count]) => [
                        emotion,
                        count / sessionDetails.summary.total_analyses,
                      ])
                    )}
                    title="Session Emotion Distribution"
                  />
                )}
              </div>

              {/* Top Emotions by Confidence */}
              <div className="chart-panel">
                <div className="chart-header">
                  <h3 className="chart-title">Top Emotions by Confidence</h3>
                  <div className="chart-type-selector">
                    <button
                      onClick={() => setTopEmotionsChartType("bar")}
                      className={`chart-type-btn ${
                        topEmotionsChartType === "bar" ? "active" : ""
                      }`}
                    >
                      <span className="btn-icon">📊</span>
                      <span>Bar</span>
                    </button>
                    <button
                      onClick={() => setTopEmotionsChartType("pie")}
                      className={`chart-type-btn ${
                        topEmotionsChartType === "pie" ? "active" : ""
                      }`}
                    >
                      <span className="btn-icon">🥧</span>
                      <span>Pie</span>
                    </button>
                  </div>
                </div>

                {topEmotionsChartType === "bar" ? (
                  <EmotionBarChart
                    emotions={Object.fromEntries(
                      Object.entries(
                        sessionDetails.summary.emotion_distribution
                      ).map(([emotion, count]) => [
                        emotion,
                        count / sessionDetails.summary.total_analyses,
                      ])
                    )}
                    title="Top Emotions by Confidence"
                  />
                ) : (
                  <EmotionPieChart
                    emotions={Object.fromEntries(
                      Object.entries(
                        sessionDetails.summary.emotion_distribution
                      ).map(([emotion, count]) => [
                        emotion,
                        count / sessionDetails.summary.total_analyses,
                      ])
                    )}
                    title="Top Emotions by Confidence"
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-session-data">
            <div className="no-data-icon">📊</div>
            <p className="no-data-text">No session data available</p>
            <p className="no-data-subtext">
              Start analyzing text to create your first session
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// EmotionResults component
const EmotionResults = ({ results }) => {
  if (!results) return null;

  const emotionColors = {
    happy: "text-yellow-500 bg-yellow-50 border-yellow-200",
    sad: "text-blue-500 bg-blue-50 border-blue-200",
    angry: "text-red-500 bg-red-50 border-red-200",
    fearful: "text-purple-500 bg-purple-50 border-purple-200",
    disgusted: "text-green-500 bg-green-50 border-green-200",
    surprised: "text-orange-500 bg-orange-50 border-orange-200",
    neutral: "text-gray-500 bg-gray-50 border-gray-200",
  };

  const emotionIcons = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    fearful: "😨",
    disgusted: "😖",
    surprised: "😲",
    neutral: "😐",
  };

  return (
    <div className="emotion-results">
      {/* Dominant Emotion */}
      <div
        className={`dominant-emotion-card ${
          emotionColors[results.dominant_emotion] || emotionColors.neutral
        }`}
      >
        <div className="dominant-emotion-content">
          <div className="dominant-emotion-info">
            <div className="emotion-icon-container">
              <span className="emotion-icon">
                {emotionIcons[results.dominant_emotion]}
              </span>
            </div>
            <div>
              <h3 className="dominant-emotion-title capitalize">
                {results.dominant_emotion}
              </h3>
              <p className="dominant-emotion-label">Dominant Emotion</p>
            </div>
          </div>
          <div className="confidence-display">
            <div className="confidence-value">
              {(results.confidence * 100).toFixed(1)}%
            </div>
            <div className="confidence-label">Confidence</div>
          </div>
        </div>
      </div>

      {/* Emotion Breakdown */}
      <div className="emotion-breakdown">
        <h3 className="breakdown-title">Emotion Breakdown</h3>
        <div className="breakdown-list">
          {Object.entries(results.emotions)
            .sort(([, a], [, b]) => b - a)
            .map(([emotion, score]) => {
              const percentage = (score * 100).toFixed(1);
              const isDominant = emotion === results.dominant_emotion;

              return (
                <div key={emotion} className="breakdown-item">
                  <div className="breakdown-emotion-info">
                    <div
                      className={`breakdown-indicator ${
                        isDominant
                          ? emotionColors[emotion]
                              .split(" ")[0]
                              .replace("text-", "bg-")
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span className="breakdown-emotion-name capitalize">
                      {emotion}
                    </span>
                    {isDominant && (
                      <span className="dominant-badge">Dominant</span>
                    )}
                  </div>
                  <div className="breakdown-score">
                    <div className="score-bar-container">
                      <div
                        className={`score-bar ${emotionColors[emotion]
                          .split(" ")[0]
                          .replace("text-", "bg-")}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="score-percentage">{percentage}%</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TextAnalysis;

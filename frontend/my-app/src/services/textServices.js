//===Text Analysis APIs start======

// frontend/src/services/api.js

// Text Analysis API calls
export const analyzeTextEmotion = async (
  text,
  userId = "current_user",
  sessionId = null
) => {
  const response = await fetch("http://localhost:8000/api/text/analyze-text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      user_id: userId,
      language: "en",
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Text analysis failed");
  }

  return await response.json();
};

// Get user sessions with date-wise grouping
export const getUserSessions = async (
  userId = "current_user",
  startDate = null,
  endDate = null
) => {
  let url = `http://localhost:8000/api/text/sessions?user_id=${userId}`;

  if (startDate) {
    url += `&start_date=${startDate}`;
  }
  if (endDate) {
    url += `&end_date=${endDate}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch sessions");
  }

  return await response.json();
};

// Get detailed session analysis
export const getSessionDetails = async (
  userId = "current_user",
  sessionDate,
  sessionId = null
) => {
  let url = `http://localhost:8000/api/text/session-details?user_id=${userId}&session_date=${sessionDate}`;

  if (sessionId) {
    url += `&session_id=${sessionId}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch session details");
  }

  return await response.json();
};

// Get historical results with pagination
export const getTextAnalysisHistory = async (
  userId = "current_user",
  page = 1,
  pageSize = 10
) => {
  const response = await fetch(
    `http://localhost:8000/api/text/results?user_id=${userId}&page=${page}&page_size=${pageSize}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch history");
  }

  return await response.json();
};

// Get summary report
export const getTextAnalysisSummary = async (
  userId = "current_user",
  days = 30
) => {
  const response = await fetch(
    `http://localhost:8000/api/text/summary?user_id=${userId}&days=${days}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch summary");
  }

  return await response.json();
};

// Export results
export const exportTextAnalysisResults = async (
  userId = "current_user",
  format = "json"
) => {
  const response = await fetch(
    `http://localhost:8000/api/text/export?user_id=${userId}&format=${format}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Export failed");
  }

  return await response.json();
};

// Get model status
export const getTextModelStatus = async () => {
  const response = await fetch(
    "http://localhost:8000/api/text/text-model-status"
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to get model status");
  }

  return await response.json();
};

//====Text Analysis APIs end=====================

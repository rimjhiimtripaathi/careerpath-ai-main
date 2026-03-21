import React, { createContext, useState, useContext, useEffect } from "react";
import { assessmentAPI } from "../services/assessmentService";
import { useAuth } from "./AuthContext";

const AssessmentContext = createContext();

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};

export const AssessmentProvider = ({ children }) => {
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [userSessions, setUserSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load assessment types when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadAssessmentTypes();
      loadUserSessions();
    }
  }, [isAuthenticated]);

  const loadAssessmentTypes = async () => {
    setLoading(true);
    try {
      const response = await assessmentAPI.getAssessmentTypes();
      setAssessmentTypes(response.data);
    } catch (err) {
      setError("Failed to load assessment types");
      console.error("Error loading assessment types:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSessions = async () => {
    try {
      const response = await assessmentAPI.getUserSessions();
      setUserSessions(response.data);
    } catch (err) {
      console.error("Error loading user sessions:", err);
    }
  };

  const startAssessment = async (assessmentTypeId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await assessmentAPI.createAssessmentSession(
        assessmentTypeId
      );
      setCurrentSession(response.data);
      return { success: true, session: response.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || "Failed to start assessment";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const submitAssessment = async (
    sessionId,
    responses,
    totalScore,
    maxScore
  ) => {
    setLoading(true);

    try {
      // Submit responses
      await assessmentAPI.submitAssessmentResponses(sessionId, responses);

      // Complete session
      await assessmentAPI.completeAssessmentSession(
        sessionId,
        totalScore,
        maxScore
      );

      // Reload user sessions
      await loadUserSessions();

      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || "Failed to submit assessment";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async (
    sessionId,
    videoFile,
    processAutomatically = true
  ) => {
    setLoading(true);

    try {
      const response = await assessmentAPI.uploadAssessmentVideo(
        sessionId,
        videoFile,
        processAutomatically
      );
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to upload video";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const analyzeVideo = async (recordingId) => {
    setLoading(true);

    try {
      const response = await assessmentAPI.analyzeVideoRecording(recordingId);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to analyze video";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const clearCurrentSession = () => {
    setCurrentSession(null);
  };

  const value = {
    assessmentTypes,
    currentSession,
    userSessions,
    loading,
    error,
    startAssessment,
    submitAssessment,
    uploadVideo,
    analyzeVideo,
    clearCurrentSession,
    loadUserSessions,
    loadAssessmentTypes,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

import api from "./api";

export const assessmentAPI = {
  // Assessment Types
  getAssessmentTypes: () => api.get("/assessments/types"),

  getAssessmentType: (assessmentTypeId) =>
    api.get(`/assessments/types/${assessmentTypeId}`),

  getAssessmentQuestions: (assessmentTypeId) =>
    api.get(`/assessments/types/${assessmentTypeId}/questions`),

  // Assessment Sessions
  createAssessmentSession: (assessmentTypeId) =>
    api.post("/assessments/sessions", { assessment_type_id: assessmentTypeId }),

  submitAssessmentResponses: (sessionId, responses) =>
    api.post(`/assessments/sessions/${sessionId}/responses`, responses),

  completeAssessmentSession: (sessionId, totalScore, maxScore) =>
    api.post(
      `/assessments/sessions/${sessionId}/complete?total_score=${totalScore}&max_score=${maxScore}`
    ),

  // Video Management
  uploadAssessmentVideo: (
    sessionId,
    videoFile,
    processAutomatically = true
  ) => {
    const formData = new FormData();
    formData.append("video_file", videoFile);
    formData.append("process_automatically", processAutomatically);

    return api.post(
      `/assessments/sessions/${sessionId}/upload-video`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  analyzeVideoRecording: (recordingId) =>
    api.post(`/assessments/video-recordings/${recordingId}/analyze`),

  getVideoAnalysis: (sessionId) =>
    api.get(`/assessments/sessions/${sessionId}/video-analysis`),

  // User Sessions
  getUserSessions: () => api.get("/assessments/sessions/user"),

  getCompleteSessionResult: (sessionId) =>
    api.get(`/assessments/sessions/${sessionId}/complete-result`),
};

export default assessmentAPI;

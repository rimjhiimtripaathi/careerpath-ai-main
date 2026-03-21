import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssessment } from "../../../contexts/AssessmentContext";
import WebcamRecorder from "./WebcamRecorder";
import QuestionRenderer from "./QuestionRenderer";
import "./AssessmentSession.css";

const AssessmentSession = () => {
  const { assessmentTypeId } = useParams();
  const navigate = useNavigate();
  const {
    assessmentTypes,
    currentSession,
    startAssessment,
    submitAssessment,
    uploadVideo,
    clearCurrentSession,
  } = useAssessment();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [responseTimes, setResponseTimes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVideoOption, setShowVideoOption] = useState(false);
  const [processAutomatically, setProcessAutomatically] = useState(true);
  const [videoBlob, setVideoBlob] = useState(null);

  const assessmentType = assessmentTypes.find(
    (at) => at.id === parseInt(assessmentTypeId)
  );
  const currentQuestion = questions[currentQuestionIndex];
  const questionStartTime = useRef(null);

  useEffect(() => {
    if (assessmentTypeId && !currentSession) {
      initializeAssessment();
    }
  }, [assessmentTypeId, currentSession]);

  useEffect(() => {
    if (currentQuestion) {
      questionStartTime.current = Date.now();
    }
  }, [currentQuestion]);

  const initializeAssessment = async () => {
    const result = await startAssessment(parseInt(assessmentTypeId));
    if (result.success) {
      // In a real app, you would fetch questions from the backend
      // For now, we'll use mock questions
      loadMockQuestions();
    } else {
      navigate("/assessments");
    }
  };

  const loadMockQuestions = () => {
    // Mock questions - in real app, fetch from backend
    const mockQuestions = [
      {
        id: 1,
        question_text:
          "How much do you enjoy working with numbers and data analysis?",
        question_type: "likert_scale",
        options: [
          "Not at all",
          "Slightly",
          "Moderately",
          "Very much",
          "Extremely",
        ],
        points: 1,
        order_index: 1,
      },
      {
        id: 2,
        question_text: "Do you prefer working in teams or individually?",
        question_type: "multiple_choice",
        options: [
          "Strongly prefer individual work",
          "Prefer individual work",
          "No preference",
          "Prefer team work",
          "Strongly prefer team work",
        ],
        points: 1,
        order_index: 2,
      },
      {
        id: 3,
        question_text:
          "How comfortable are you with public speaking and presentations?",
        question_type: "likert_scale",
        options: [
          "Very uncomfortable",
          "Somewhat uncomfortable",
          "Neutral",
          "Comfortable",
          "Very comfortable",
        ],
        points: 1,
        order_index: 3,
      },
    ];
    setQuestions(mockQuestions);
  };

  const handleAnswer = (answer) => {
    if (!currentQuestion) return;

    // Calculate response time
    const responseTime = Math.floor(
      (Date.now() - questionStartTime.current) / 1000
    );

    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));

    setResponseTimes((prev) => ({
      ...prev,
      [currentQuestion.id]: responseTime,
    }));

    // Move to next question or show completion
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowVideoOption(true);
    }
  };

  const handleVideoRecorded = (blob) => {
    setVideoBlob(blob);
  };

  const handleSubmitAssessment = async () => {
    if (!currentSession) return;

    setIsSubmitting(true);

    try {
      // Prepare responses for backend
      const responseData = Object.keys(responses).map((questionId) => ({
        question_id: parseInt(questionId),
        user_answer: responses[questionId],
        response_time_seconds: responseTimes[questionId] || 0,
      }));

      // Calculate scores (mock calculation)
      const totalScore = Object.keys(responses).length * 2; // Mock score
      const maxScore = questions.length * 2; // Mock max score

      // Submit assessment
      await submitAssessment(
        currentSession.id,
        responseData,
        totalScore,
        maxScore
      );

      // Upload video if recorded
      if (videoBlob) {
        const videoFile = new File(
          [videoBlob],
          `assessment-${currentSession.id}.webm`,
          {
            type: "video/webm",
          }
        );

        await uploadVideo(currentSession.id, videoFile, processAutomatically);
      }

      // Navigate to results
      navigate(`/assessment-results/${currentSession.id}`);
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setIsSubmitting(false);
      clearCurrentSession();
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!assessmentType) {
    return <div>Loading assessment...</div>;
  }

  return (
    <div className="assessment-session">
      {/* Header */}
      <div className="assessment-header">
        <div className="assessment-info">
          <h1>{assessmentType.name}</h1>
          <p>{assessmentType.description}</p>
        </div>
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="assessment-content">
        {/* Webcam Recorder - Always visible during assessment */}
        <div className="webcam-section">
          <WebcamRecorder
            onRecordingComplete={handleVideoRecorded}
            recordingEnabled={!showVideoOption}
          />
        </div>

        {/* Question Section */}
        {!showVideoOption && currentQuestion && (
          <div className="question-section">
            <QuestionRenderer
              question={currentQuestion}
              onAnswer={handleAnswer}
              currentAnswer={responses[currentQuestion.id]}
            />
          </div>
        )}

        {/* Completion Section */}
        {showVideoOption && (
          <div className="completion-section">
            <div className="completion-card">
              <h2>Assessment Complete! 🎉</h2>
              <p>
                You have answered all questions. Your video has been recorded.
              </p>

              <div className="video-options">
                <h3>Video Processing Options</h3>
                <div className="option-group">
                  <label className="option-label">
                    <input
                      type="radio"
                      name="processingOption"
                      value="auto"
                      checked={processAutomatically}
                      onChange={() => setProcessAutomatically(true)}
                    />
                    <span>Process video automatically (Recommended)</span>
                  </label>

                  <label className="option-label">
                    <input
                      type="radio"
                      name="processingOption"
                      value="manual"
                      checked={!processAutomatically}
                      onChange={() => setProcessAutomatically(false)}
                    />
                    <span>Process video later manually</span>
                  </label>
                </div>

                <div className="processing-info">
                  <p>
                    <strong>Video analysis includes:</strong>
                  </p>
                  <ul>
                    <li>Emotional & Mood Analysis</li>
                    <li>Intent & Purpose Analysis</li>
                    <li>Personality & Psychological Traits</li>
                    <li>Cognitive & Analytical Dimensions</li>
                  </ul>
                </div>
              </div>

              <div className="completion-actions">
                <button
                  className="submit-btn"
                  onClick={handleSubmitAssessment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Assessment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentSession;

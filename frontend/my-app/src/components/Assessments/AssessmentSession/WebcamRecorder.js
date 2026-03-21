import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import "./WebcamRecorder.css";

const WebcamRecorder = ({ onRecordingComplete, recordingEnabled = true }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef(null);

  // Start camera when component mounts
  useEffect(() => {
    if (recordingEnabled) {
      setCameraActive(true);
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [recordingEnabled]);

  const startRecording = useCallback(() => {
    if (!webcamRef.current || !cameraActive) return;

    setRecordedChunks([]);

    try {
      const stream = webcamRef.current.video.srcObject;
      if (!stream) return;

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.addEventListener("stop", handleRecordingStop);

      mediaRecorderRef.current.start();
      setRecording(true);

      // Start recording timer
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }, [cameraActive]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  }, [recording]);

  const handleDataAvailable = useCallback(({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => [...prev, data]);
    }
  }, []);

  const handleRecordingStop = useCallback(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      onRecordingComplete(blob);
    }
  }, [recordedChunks, onRecordingComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Auto start/stop recording based on recordingEnabled prop
  useEffect(() => {
    if (recordingEnabled && cameraActive && !recording) {
      startRecording();
    } else if (!recordingEnabled && recording) {
      stopRecording();
    }
  }, [
    recordingEnabled,
    cameraActive,
    recording,
    startRecording,
    stopRecording,
  ]);

  const toggleCamera = () => {
    if (cameraActive) {
      stopRecording();
      setCameraActive(false);
    } else {
      setCameraActive(true);
    }
  };

  return (
    <div className="webcam-recorder">
      <div className="webcam-header">
        <h3>Assessment Recording</h3>
        <div className="webcam-status">
          <span
            className={`status-indicator ${
              cameraActive ? "active" : "inactive"
            }`}
          >
            {cameraActive ? "● Camera Active" : "○ Camera Inactive"}
          </span>
          {recording && (
            <span className="recording-indicator">
              🔴 Recording: {formatTime(recordingTime)}
            </span>
          )}
        </div>
      </div>

      <div className="webcam-container">
        {cameraActive ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={true}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "user",
              }}
              className="webcam-video"
            />
            <div className="recording-overlay">
              {recording && (
                <div className="recording-pulse">
                  <div className="pulse-circle"></div>
                  <span>REC</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="camera-off-placeholder">
            <div className="camera-off-icon">📷</div>
            <p>Camera is turned off</p>
            <button className="enable-camera-btn" onClick={toggleCamera}>
              Enable Camera
            </button>
          </div>
        )}
      </div>

      <div className="webcam-controls">
        <button
          className={`camera-toggle-btn ${cameraActive ? "active" : ""}`}
          onClick={toggleCamera}
        >
          {cameraActive ? "Turn Off Camera" : "Turn On Camera"}
        </button>

        <div className="recording-info">
          <p>
            <strong>Privacy Note:</strong> Your video is recorded locally and
            only uploaded when you submit the assessment. Video analysis helps
            provide better career recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebcamRecorder;

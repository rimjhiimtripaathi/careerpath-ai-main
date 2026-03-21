// EmotionCapturePage.js
import React, { useState, useRef, useEffect } from "react";
import "./EmotionCapturePage.css";

const API_BASE = "http://localhost:8000";

const EmotionCapturePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotionLog, setEmotionLog] = useState([]);
  const [chartUrl, setChartUrl] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [latestEmotion, setLatestEmotion] = useState(null);
  const [status, setStatus] = useState("");

  // Initialize webcam
  useEffect(() => {
    const initializeWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setStatus("Error accessing webcam. Please check permissions.");
      }
    };

    initializeWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64
    return canvas.toDataURL("image/jpeg", 0.8);
  };

  const processFrame = async () => {
    try {
      const frameData = captureFrame();
      if (!frameData) return;

      const res = await fetch(`${API_BASE}/process-frame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: frameData }),
      });

      if (!res.ok) throw new Error("Failed to process frame");

      const data = await res.json();

      if (data.dominant_emotion && !data.error) {
        const timestamp = new Date().toLocaleTimeString();
        const emotionEntry = {
          id: Date.now(),
          timestamp,
          dominant: data.dominant_emotion,
          emotions: data.emotions,
          fullData: data,
        };

        setLatestEmotion(emotionEntry);
        setEmotionLog((prev) => [emotionEntry, ...prev.slice(0, 19)]);
      }
    } catch (err) {
      console.error("Process frame error:", err);
    }
  };

  const startCapture = async () => {
    try {
      setStatus("Starting capture...");
      const res = await fetch(`${API_BASE}/start-capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("Capture started successfully!");
        setIsCapturing(true);
        setEmotionLog([]);
        setLatestEmotion(null);

        // Process frames every 2 seconds
        const id = setInterval(processFrame, 2000);
        setIntervalId(id);
      } else {
        setStatus(`Error: ${data.detail || data.status}`);
      }
    } catch (err) {
      console.error("Start capture error:", err);
      setStatus("Failed to start capture. Is the server running?");
    }
  };

  const stopCapture = async () => {
    try {
      setStatus("Stopping capture...");
      const res = await fetch(`${API_BASE}/stop-capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("Capture stopped successfully!");
        setIsCapturing(false);
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
        fetchReport();
      } else {
        setStatus(`Error: ${data.detail || data.status}`);
      }
    } catch (err) {
      console.error("Stop capture error:", err);
      setStatus("Failed to stop capture.");
    }
  };

  const fetchReport = async () => {
    try {
      const res = await fetch(`${API_BASE}/report`);
      if (res.ok) {
        const data = await res.json();
        console.log("Report data:", data);
        setStatus(`Capture completed! Processed ${data.total_frames} frames.`);
      }
    } catch (err) {
      console.error("Fetch report error:", err);
    }
  };

  const fetchChart = async (type) => {
    try {
      setStatus(`Generating ${type} chart...`);
      const res = await fetch(`${API_BASE}/report-plot?chart_type=${type}`);
      if (!res.ok) throw new Error("Failed to fetch chart");

      const blob = await res.blob();
      if (blob.size === 0) throw new Error("Empty chart response");

      const url = URL.createObjectURL(blob);
      setChartUrl(url);
      setStatus(
        `${type.charAt(0).toUpperCase() + type.slice(1)} chart generated!`
      );
    } catch (err) {
      console.error("Fetch chart error:", err);
      setStatus("Failed to generate chart. Make sure you have capture data.");
    }
  };

  const getEmotionColorClass = (emotion) => {
    return `emotion-${emotion}`;
  };

  const getStatusClass = () => {
    if (status.includes("Error")) return "error";
    if (status.includes("started") || status.includes("completed"))
      return "success";
    return "info";
  };

  return (
    <div className="emotion-capture-container">
      <div className="dashboard-header">
        <h1>Video Assessment Dashboard</h1>
        <div className="subtitle">
          Real-time Facial Emotion Detection & Analysis
        </div>
      </div>

      {status && (
        <div className={`status-container ${getStatusClass()} fade-in`}>
          {status}
          {isCapturing && <span className="live-indicator">LIVE</span>}
        </div>
      )}

      <div className="main-layout">
        <div className="content-main">
          <div className="webcam-section">
            <h3 className="section-title">
              Live Camera Feed
              {isCapturing && <span className="live-indicator">LIVE</span>}
            </h3>
            <div className="webcam-feed">
              <video
                ref={videoRef}
                width="500"
                height="375"
                autoPlay
                muted
                playsInline
              />
              <canvas
                ref={canvasRef}
                style={{ display: "none" }}
                width="640"
                height="480"
              />
            </div>

            <div className="controls-container">
              <button
                onClick={startCapture}
                disabled={isCapturing}
                className="btn btn-primary"
              >
                <span>▶️</span>
                Start Capture
              </button>
              <button
                onClick={stopCapture}
                disabled={!isCapturing}
                className="btn btn-danger"
              >
                <span>⏹️</span>
                Stop Capture
              </button>
              <button
                onClick={() => fetchChart("bar")}
                className="btn btn-info"
              >
                <span>📊</span>
                Bar Chart
              </button>
              <button
                onClick={() => fetchChart("pie")}
                className="btn btn-warning"
              >
                <span>🥧</span>
                Pie Chart
              </button>
            </div>
          </div>

          <div className="dashboard-cards">
            {latestEmotion && (
              <div className="current-emotion fade-in">
                <h3 className="emotion-title">Current Emotion</h3>
                <div className="emotion-value">
                  {latestEmotion.dominant.toUpperCase()}
                </div>
                <div className="emotion-timestamp">
                  {latestEmotion.timestamp}
                </div>
                {latestEmotion.fullData?.age && (
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "0.9rem",
                      color: "#7f8c8d",
                    }}
                  >
                    Age: {latestEmotion.fullData.age} | Gender:{" "}
                    {latestEmotion.fullData.gender || "Unknown"}
                  </div>
                )}
              </div>
            )}

            {chartUrl && (
              <div className="chart-section fade-in">
                <h3 className="chart-title">Emotion Distribution</h3>
                <img
                  src={chartUrl}
                  alt="Emotion Chart"
                  className="chart-image"
                />
              </div>
            )}
          </div>
        </div>

        <div className="emotion-log">
          <div className="log-header">
            <h3>Emotion Log</h3>
            <span className="log-count">({emotionLog.length})</span>
          </div>
          <div className="log-entries">
            {emotionLog.length === 0 ? (
              <div className="empty-log">
                No emotions captured yet
                <div style={{ fontSize: "0.9rem", marginTop: "8px" }}>
                  Start capture to begin analysis
                </div>
              </div>
            ) : (
              emotionLog.map((entry) => (
                <div
                  key={entry.id}
                  className={`log-entry ${getEmotionColorClass(
                    entry.dominant
                  )}`}
                >
                  <div className="log-emotion">{entry.dominant}</div>
                  <div className="log-timestamp">{entry.timestamp}</div>
                  {entry.fullData?.age && (
                    <div className="log-age-gender">
                      Age: {entry.fullData.age} | Gender:{" "}
                      {entry.fullData.gender || "Unknown"}
                    </div>
                  )}
                  <div className="log-confidence">
                    Confidence:{" "}
                    {Math.max(...Object.values(entry.emotions)).toFixed(1)}%
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionCapturePage;

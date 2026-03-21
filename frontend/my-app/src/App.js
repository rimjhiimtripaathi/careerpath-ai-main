import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { AssessmentProvider } from "./contexts/AssessmentContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import AssessmentPortal from "./components/Assessments/AssessmentPortal";
import AssessmentSession from "./components/Assessments/AssessmentSession/AssessmentSession";
import AssessmentResults from "./components/Assessments/AssessmentResults";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import "./App.css";
import TextAnalysis from "./components/Assessments/TextAnalysis";
import EmotionCapturePage from "./components/Assessments/EmotionCapturePage";

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AssessmentProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessments"
                  element={
                    <ProtectedRoute>
                      <AssessmentPortal />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/text-analysis"
                  element={
                    <ProtectedRoute>
                      <TextAnalysis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/video-analysis"
                  element={
                    <ProtectedRoute>
                      <EmotionCapturePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment/:assessmentTypeId"
                  element={
                    <ProtectedRoute>
                      <AssessmentSession />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment-results/:sessionId"
                  element={
                    <ProtectedRoute>
                      <AssessmentResults />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </Router>
        </AssessmentProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;

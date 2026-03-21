import React, { createContext, useState, useContext, useEffect } from "react";
import { userAPI } from "../services/userService";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Load profile when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserProfile();
    } else {
      setProfile(null);
    }
  }, [isAuthenticated, user]);

  const loadUserProfile = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await userAPI.getCurrentUserProfile();
      setProfile(response.data.profile);
    } catch (err) {
      console.error("Error loading user profile:", err);
      setError(err.response?.data?.detail || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userAPI.updateUserProfile(profileData);
      setProfile(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to update profile";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    loadUserProfile();
  };

  const value = {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile,
    hasProfile: !!profile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

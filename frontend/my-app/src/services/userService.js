import api from "./api";

export const userAPI = {
  // Get current user's profile
  getCurrentUserProfile: () => api.get("/users/me/profile"),

  // Get user profile by ID
  getUserProfile: (userId) => api.get(`/users/${userId}/profile`),

  // Update user profile
  updateUserProfile: (profileData) => api.put("/users/me/profile", profileData),

  // Get complete user details
  getCurrentUserDetails: () => api.get("/users/me"),
};

export default userAPI;

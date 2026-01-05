import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useRatingStore = create((set, get) => ({
  mentorRatings: [],
  userRating: null,
  isLoading: false,

  fetchMentorRatings: async (mentorId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/ratings/mentor/${mentorId}`);
      set({ mentorRatings: res.data.ratings });
    } catch (error) {
      console.log("Error fetching mentor ratings:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserRating: async (mentorId) => {
    try {
      const res = await axiosInstance.get(`/ratings/user/${mentorId}`);
      set({ userRating: res.data });
    } catch (error) {
      console.log("Error fetching user rating:", error);
    }
  },

  submitRating: async (mentorId, rating, review) => {
    try {
      const res = await axiosInstance.post("/ratings/add", {
        mentorId,
        rating,
        review,
      });
      
      set({ userRating: { mentorId, rating, review } });
      toast.success("Rating submitted successfully!");
      
      // Refresh mentor ratings
      get().fetchMentorRatings(mentorId);
      
      return res.data;
    } catch (error) {
      console.log("Error submitting rating:", error);
      toast.error("Failed to submit rating");
    }
  },
}));

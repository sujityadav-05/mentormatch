import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useMentorStore = create((set) => ({
  pendingRequests: [],
  isFetching: false,

  fetchPendingRequests: async () => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/mentorship/pending-requests");
      set({ pendingRequests: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching pending requests");
    } finally {
      set({ isFetching: false });
    }
  },

  // Send mentor request (Mentee sends to Mentor)
  requestMentorship: async (mentorId) => {
    try {
      const res = await axiosInstance.post(`/mentorship/request/${mentorId}`);
      toast.success("Request sent to mentor");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
      throw error;
    }
  },

  // Cancel mentor request (Mentee cancels pending request)
  cancelRequest: async (mentorId) => {
    try {
      await axiosInstance.post(`/mentorship/cancel/${mentorId}`);
      toast.success("Request cancelled");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel request");
      throw error;
    }
  },

  // Accept request (Mentor accepts Mentee's request)
  acceptRequest: async (menteeId) => {
    try {
      const res = await axiosInstance.post(`/mentorship/accept/${menteeId}`);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter((r) => r.mentee._id !== menteeId),
      }));
      toast.success("Request accepted");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error accepting request");
      throw error;
    }
  },

  // Reject request (Mentor rejects Mentee's request)
  rejectRequest: async (menteeId) => {
    try {
      const res = await axiosInstance.post(`/mentorship/reject/${menteeId}`);
      set((state) => ({
        pendingRequests: state.pendingRequests.filter((r) => r.mentee._id !== menteeId),
      }));
      toast.success("Request rejected");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error rejecting request");
      throw error;
    }
  },
}));
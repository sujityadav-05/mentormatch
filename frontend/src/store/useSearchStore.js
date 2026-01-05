import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useSearchStore = create((set) => ({
  mentors: [],
  pagination: {},
  isLoading: false,
  searchParams: {
    search: "",
    expertise: [],
    minRating: 0,
    page: 1,
    limit: 10,
  },

  setSearchParams: (params) => {
    set((state) => ({
      searchParams: { ...state.searchParams, ...params, page: 1 },
    }));
  },

  setPage: (page) => {
    set((state) => ({
      searchParams: { ...state.searchParams, page },
    }));
  },

  searchMentors: async (state) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams();
      
      if (state.searchParams.search) queryParams.append("search", state.searchParams.search);
      if (state.searchParams.expertise && state.searchParams.expertise.length > 0) {
        state.searchParams.expertise.forEach((e) => queryParams.append("expertise", e));
      }
      if (state.searchParams.minRating > 0) queryParams.append("minRating", state.searchParams.minRating);
      queryParams.append("page", state.searchParams.page);
      queryParams.append("limit", state.searchParams.limit);

      const res = await axiosInstance.get(`/mentorship/mentors?${queryParams.toString()}`);
      set({ mentors: res.data.mentors, pagination: res.data.pagination });
    } catch (error) {
      console.log("Error searching mentors:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

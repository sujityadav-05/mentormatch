import { useSearchStore } from "../store/useSearchStore";
import { useMentorStore } from "../store/useMentorStore";
import { useEffect, useState } from "react";
import { Search, Star, Loader } from "lucide-react";
import toast from "react-hot-toast";

const EXPERTISE_OPTIONS = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "System Design",
  "Frontend",
  "Backend",
  "Full Stack",
  "Python",
  "JavaScript",
  "Java",
];

export const MentorSearchFilter = () => {
  const { searchParams, setSearchParams, setPage, mentors, pagination, isLoading, searchMentors } =
    useSearchStore();
  const { requestMentorship, cancelRequest } = useMentorStore();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const state = useSearchStore.getState();
    state.searchMentors(state);
  }, [searchParams]);

  const handleSearchChange = (e) => {
    setSearchParams({ search: e.target.value });
  };

  const handleExpertiseToggle = (expertise) => {
    const updated = searchParams.expertise.includes(expertise)
      ? searchParams.expertise.filter((e) => e !== expertise)
      : [...searchParams.expertise, expertise];
    setSearchParams({ expertise: updated });
  };

  const handleRatingChange = (rating) => {
    setSearchParams({ minRating: parseInt(rating) });
  };

  const handleRequestMentorship = async (mentorId) => {
    try {
      await requestMentorship(mentorId);
      // Refresh the list
      const state = useSearchStore.getState();
      state.searchMentors(state);
    } catch (error) {
      console.log("Error requesting mentorship:", error);
    }
  };

  const handleCancelRequest = async (mentorId) => {
    try {
      await cancelRequest(mentorId);
      // Refresh the list
      const state = useSearchStore.getState();
      state.searchMentors(state);
    } catch (error) {
      console.log("Error canceling request:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="form-control">
        <div className="input-group w-full">
          <input
            type="text"
            placeholder="Search by name, email, or expertise..."
            value={searchParams.search}
            onChange={handleSearchChange}
            className="input input-bordered w-full"
          />
          <button className="btn btn-square" onClick={() => searchMentors()}>
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="btn btn-outline w-full"
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {showFilters && (
        <div className="card bg-base-200 p-4 space-y-4">
          {/* Rating Filter */}
          <div>
            <label className="label font-semibold">Minimum Rating</label>
            <select
              value={searchParams.minRating}
              onChange={(e) => handleRatingChange(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="0">All Ratings</option>
              <option value="1">1+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          {/* Expertise Filter */}
          <div>
            <label className="label font-semibold">Expertise Areas</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {EXPERTISE_OPTIONS.map((expertise) => (
                <label key={expertise} className="label cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchParams.expertise.includes(expertise)}
                    onChange={() => handleExpertiseToggle(expertise)}
                    className="checkbox checkbox-sm"
                  />
                  <span className="label-text text-sm">{expertise}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        <p className="text-sm font-semibold mb-2">
          Found {pagination.total} mentors
          {pagination.totalPages > 1 && ` (Page ${pagination.page}/${pagination.totalPages})`}
        </p>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin" size={32} />
          </div>
        ) : mentors.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No mentors found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors.map((mentor) => (
              <div key={mentor._id} className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title text-lg">{mentor.fullName}</h3>
                  <p className="text-sm text-gray-600">{mentor.email}</p>

                  {mentor.bio && <p className="text-sm my-2">{mentor.bio}</p>}

                  {/* Rating */}
                  <div className="flex items-center gap-2 my-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.round(mentor.averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm">
                      {mentor.averageRating} ({mentor.totalRatings})
                    </span>
                  </div>

                  {/* Expertise Tags */}
                  {mentor.expertise && mentor.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1 my-2">
                      {mentor.expertise.slice(0, 3).map((exp) => (
                        <span key={exp} className="badge badge-primary badge-sm">
                          {exp}
                        </span>
                      ))}
                      {mentor.expertise.length > 3 && (
                        <span className="badge badge-outline badge-sm">
                          +{mentor.expertise.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div className="card-actions mt-4">
                    {mentor.status === "pending" && (
                      <button 
                        onClick={() => handleCancelRequest(mentor._id)}
                        className="btn btn-warning btn-sm w-full"
                      >
                        Request Pending - Cancel
                      </button>
                    )}
                    {mentor.status === "accepted" && (
                      <button className="btn btn-success btn-sm w-full" disabled>
                        ✓ Connected
                      </button>
                    )}
                    {mentor.status === "not_requested" && (
                      <button 
                        onClick={() => handleRequestMentorship(mentor._id)}
                        className="btn btn-primary btn-sm w-full"
                      >
                        Request Mentorship
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn btn-sm"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`btn btn-sm ${pagination.page === i + 1 ? "btn-active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="btn btn-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

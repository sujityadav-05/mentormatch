import { useRatingStore } from "../store/useRatingStore";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

export const RatingCard = ({ mentorId }) => {
  const { mentorRatings, userRating, fetchMentorRatings, fetchUserRating, submitRating } =
    useRatingStore();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (mentorId) {
      fetchMentorRatings(mentorId);
      fetchUserRating(mentorId);
    }
  }, [mentorId, fetchMentorRatings, fetchUserRating]);

  useEffect(() => {
    if (mentorRatings.length > 0) {
      const avg = (mentorRatings.reduce((sum, r) => sum + r.rating, 0) / mentorRatings.length).toFixed(1);
      setAverageRating(avg);
    }
  }, [mentorRatings]);

  useEffect(() => {
    if (userRating) {
      setRating(userRating.rating || 0);
      setReview(userRating.review || "");
    }
  }, [userRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    await submitRating(mentorId, rating, review);
  };

  return (
    <div className="card bg-base-200 shadow-lg p-6 mt-4">
      <h3 className="text-xl font-bold mb-4">Ratings & Reviews</h3>

      {/* Average Rating Display */}
      <div className="mb-4 flex items-center gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold">{averageRating}</p>
          <div className="flex gap-1 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">({mentorRatings.length} reviews)</p>
        </div>
      </div>

      {/* Rating Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
        <h4 className="font-semibold">Leave a Rating</h4>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="btn btn-sm btn-outline"
            >
              <Star
                size={18}
                className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            </button>
          ))}
        </div>

        <textarea
          placeholder="Write your review (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="textarea textarea-bordered w-full"
          rows="3"
          maxLength="500"
        />

        <button type="submit" className="btn btn-primary w-full">
          Submit Rating
        </button>
      </form>

      {/* Reviews List */}
      {mentorRatings.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-3">Recent Reviews</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mentorRatings.slice(0, 5).map((r) => (
              <div key={r._id} className="p-3 bg-white rounded border">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm">{r.menteeId.fullName}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
                {r.review && <p className="text-sm text-gray-600">{r.review}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

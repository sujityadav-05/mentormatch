import { Rating } from "../models/rating.model.js";
import User from "../models/user.model.js";

export const addRating = async (req, res) => {
  try {
    const { mentorId, rating, review } = req.body;
    const menteeId = req.user.id;

    if (!mentorId || !rating) {
      return res.status(400).json({ message: "Mentor ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if rating already exists
    let existingRating = await Rating.findOne({ mentorId, menteeId });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review;
      await existingRating.save();
    } else {
      // Create new rating
      const newRating = new Rating({
        mentorId,
        menteeId,
        rating,
        review,
      });
      await newRating.save();
    }

    // Calculate average rating for mentor
    const ratings = await Rating.find({ mentorId });
    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;

    // Update mentor's average rating
    await User.findByIdAndUpdate(mentorId, { averageRating: avgRating, totalRatings: ratings.length });

    res.status(200).json({ message: "Rating added successfully", avgRating, totalRatings: ratings.length });
  } catch (error) {
    console.log("Error in addRating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMentorRatings = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const ratings = await Rating.find({ mentorId }).populate("menteeId", "fullName profilePic");

    // Calculate average rating
    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0;

    res.status(200).json({
      ratings,
      averageRating: avgRating,
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.log("Error in getMentorRatings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserRating = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const menteeId = req.user.id;

    const rating = await Rating.findOne({ mentorId, menteeId });

    res.status(200).json(rating || {});
  } catch (error) {
    console.log("Error in getUserRating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

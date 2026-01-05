import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    review: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Prevent duplicate ratings from same mentee to same mentor
ratingSchema.index({ mentorId: 1, menteeId: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", ratingSchema);

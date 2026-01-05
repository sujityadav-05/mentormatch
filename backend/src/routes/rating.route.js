import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addRating, getMentorRatings, getUserRating } from "../controllers/rating.controller.js";

const router = express.Router();

router.post("/add", protectRoute, addRating);
router.get("/mentor/:mentorId", getMentorRatings);
router.get("/user/:mentorId", protectRoute, getUserRating);

export default router;

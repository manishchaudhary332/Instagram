import express from "express";
import {
  register,
  getProfile,
  login,
  logout,
  editProfile,
  getSuggestedUsers,
  followorunfollow,
  checkAuth,
  
} from "../controllers/user.controller.js";

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router.route("/profile/edit").post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthenticated, followorunfollow);

// ✅ Add this new route
router.route("/check-auth").get(isAuthenticated, checkAuth);

export default router;

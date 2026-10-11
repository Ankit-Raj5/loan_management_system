import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Public: create a new borrower account (staff roles are rejected)
router.post("/register", asyncHandler(authController.register));

// Public: log in with email, password and the role chosen on the login screen
router.post("/login", asyncHandler(authController.login));

// Authenticated: get the logged-in user's profile
router.get("/me", authenticate, asyncHandler(authController.me));

// Authenticated: change the logged-in user's password
router.patch("/change-password", authenticate, asyncHandler(authController.changePassword));

export default router;

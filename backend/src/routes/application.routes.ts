import { Router } from "express";
import * as applicationController from "../controllers/application.controller";
import { authenticate } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/rbac.middleware";
import { uploadSalarySlip } from "../middleware/upload.middleware";
import { Role } from "../types/roles";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Every application route requires a logged-in BORROWER (executives and admin are rejected)
router.use(authenticate, restrictTo(Role.BORROWER));

// Borrower: live loan calculation preview (query: amount, tenureDays)
router.get("/calculate", asyncHandler(applicationController.calculateLoan));

// Borrower: step 2, submit personal details and run the eligibility check
router.post("/personal-details", asyncHandler(applicationController.submitPersonalDetails));

// Borrower: list my loan applications
router.get("/", asyncHandler(applicationController.listMyApplications));

// Borrower: get one of my loan applications
router.get("/:id", asyncHandler(applicationController.getMyApplication));

// Borrower: step 3, upload the salary slip (multipart field "salarySlip")
router.post("/:id/salary-slip", uploadSalarySlip, asyncHandler(applicationController.uploadSalarySlip));

// Borrower: step 4, apply for the loan with amount and tenure
router.post("/:id/apply", asyncHandler(applicationController.applyForLoan));

export default router;

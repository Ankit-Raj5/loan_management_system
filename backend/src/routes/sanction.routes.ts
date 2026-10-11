import { Router } from "express";
import * as sanctionController from "../controllers/sanction.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { Role } from "../types/roles";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Every sanction route requires a logged-in SANCTION executive (Admin also allowed)
router.use(authenticate, authorize(Role.SANCTION));

// Sanction: list loans in the review queue (default APPLIED), optional ?status= filter
router.get("/applications", asyncHandler(sanctionController.listApplications));

// Sanction: get one loan with borrower details, loan terms and audit trail
router.get("/applications/:id", asyncHandler(sanctionController.getApplication));

// Sanction: get a short-lived link to view the borrower's salary slip
router.get("/applications/:id/salary-slip", asyncHandler(sanctionController.getSalarySlipLink));

// Sanction: approve an applied loan (APPLIED -> SANCTIONED)
router.post("/applications/:id/approve", asyncHandler(sanctionController.approve));

// Sanction: reject an applied loan with a reason (APPLIED -> REJECTED)
router.post("/applications/:id/reject", asyncHandler(sanctionController.reject));

export default router;

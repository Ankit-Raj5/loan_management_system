import { Router } from "express";
import * as disbursementController from "../controllers/disbursement.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { Role } from "../types/roles";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Every disbursement route requires a logged-in DISBURSEMENT executive (Admin also allowed)
router.use(authenticate, authorize(Role.DISBURSEMENT));

// Disbursement: list loans in the queue (default SANCTIONED), optional ?status= filter
router.get("/loans", asyncHandler(disbursementController.listLoans));

// Disbursement: get one loan with borrower details, loan terms and audit trail
router.get("/loans/:id", asyncHandler(disbursementController.getLoan));

// Disbursement: release funds for a sanctioned loan (SANCTIONED -> DISBURSED)
router.post("/loans/:id/disburse", asyncHandler(disbursementController.disburse));

export default router;

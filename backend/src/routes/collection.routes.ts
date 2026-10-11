import { Router } from "express";
import * as collectionController from "../controllers/collection.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { Role } from "../types/roles";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Every collection route requires a logged-in COLLECTION executive (Admin also allowed)
router.use(authenticate, authorize(Role.COLLECTION));

// Collection: list loans (default DISBURSED), optional ?status= filter
router.get("/loans", asyncHandler(collectionController.listLoans));

// Collection: get one loan with balance, audit trail and payment history
router.get("/loans/:id", asyncHandler(collectionController.getLoan));

// Collection: record a payment (UTR, amount, date); loan auto-closes when fully repaid
router.post("/loans/:id/payments", asyncHandler(collectionController.recordPayment));

export default router;

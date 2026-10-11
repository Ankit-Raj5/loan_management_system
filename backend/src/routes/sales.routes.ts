import { Router } from "express";
import * as salesController from "../controllers/sales.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { Role } from "../types/roles";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Every sales route requires a logged-in SALES executive (Admin also allowed)
router.use(authenticate, authorize(Role.SALES));

// Sales: list leads (borrowers who have not submitted an application), optional ?stage= filter
router.get("/leads", asyncHandler(salesController.listLeads));

export default router;

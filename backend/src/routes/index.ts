import { Router } from "express";
import { mountRouter } from "../utils/routeRegistry";
import applicationRoutes from "./application.routes";
import authRoutes from "./auth.routes";

const router = Router();

// Public: health check to confirm the API is running
router.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK", data: { uptime: process.uptime() } });
});

mountRouter(router, "/auth", authRoutes);
mountRouter(router, "/applications", applicationRoutes);

export default router;

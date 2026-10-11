import { Router } from "express";
import { mountRouter } from "../utils/routeRegistry";
import applicationRoutes from "./application.routes";
import authRoutes from "./auth.routes";
import collectionRoutes from "./collection.routes";
import disbursementRoutes from "./disbursement.routes";
import salesRoutes from "./sales.routes";
import sanctionRoutes from "./sanction.routes";

const router = Router();

// Public: health check to confirm the API is running
router.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK", data: { uptime: process.uptime() } });
});

mountRouter(router, "/auth", authRoutes);
mountRouter(router, "/applications", applicationRoutes);
mountRouter(router, "/sales", salesRoutes);
mountRouter(router, "/sanction", sanctionRoutes);
mountRouter(router, "/disbursement", disbursementRoutes);
mountRouter(router, "/collection", collectionRoutes);

export default router;

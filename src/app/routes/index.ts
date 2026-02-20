import { Router } from "express";
import { specialtyRoutes } from "../modules/specialty/specialty.routes";
import { authRoutes } from "../modules/auth/auth.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/specialties", specialtyRoutes);

export const indexRoutes = router;
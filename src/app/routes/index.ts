import { Router } from "express";
import { specialtyRoutes } from "../modules/specialty/specialty.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/user/user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/specialties", specialtyRoutes);
router.use("/users", userRoutes);

export const indexRoutes = router;
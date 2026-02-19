import { Router } from "express";
import { specialtyController } from "./specialty.controller";

const router = Router();

router.post("/", specialtyController.createSpecialty);
router.get("/", specialtyController.getAllSpecialty);
router.delete("/:specialtyId", specialtyController.deleteSpecialty);

export const specialtyRoutes = router;
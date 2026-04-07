import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { appointmentController } from "./appointment.controller";

const router = Router();

router.post("/book-appointment", checkAuth(Role.PATIENT), appointmentController.bookAppointment);
router.get("/my-appointments", checkAuth(Role.PATIENT, Role.DOCTOR), appointmentController.getMyAppointments);
router.patch("/change-appointment-status/:id", checkAuth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN),appointmentController.changeAppointmentStatus);
router.get("/my-single-appointment/:id", checkAuth(Role.PATIENT, Role.DOCTOR), appointmentController.getMySingleAppointment);
router.get("/all-appointments", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), appointmentController.getAllAppointments);
router.post("/book-appointment-with-pay-later", checkAuth(Role.PATIENT), appointmentController.bookAppointmentWithPayLater);
router.post("/initiate-payment/:id", checkAuth(Role.PATIENT), appointmentController.initiatePayment);

export const AppointmentRoutes = router;
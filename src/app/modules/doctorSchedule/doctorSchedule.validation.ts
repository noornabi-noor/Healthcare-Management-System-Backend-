import z from "zod";

const createDoctorScheduleZodSchema = z.object({
    scheduleIds: z.array(z.string().uuid("Invalid UUID format")).min(1, "scheduleIds must contain at least one schedule ID")
});

const updateDoctorScheduleZodSchema = z.object({
    scheduleIds: z.array(
        z.object({
            id: z.string().uuid({ message: "id must be a valid UUID" }),
            shouldDelete: z.boolean()
        })
    ).min(1, { message: "scheduleIds must contain at least one schedule" })
});

export const DoctorScheduleValidation = {
    createDoctorScheduleZodSchema,
    updateDoctorScheduleZodSchema
};

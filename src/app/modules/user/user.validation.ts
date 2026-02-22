import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(20, { message: "Password must not exceed 20 characters." }),

  doctor: z.object({
    name: z
      .string()
      .min(1, { message: "Doctor name is required." })
      .max(35, { message: "Name must not exceed 35 characters." }),

    email: z
      .string()
      .min(1, { message: "Email address is required." })
      .email({ message: "Please provide a valid email address." }),

    profilePhoto: z
      .string()
      .url({ message: "Profile photo must be a valid URL." })
      .optional(),

    contactNumber: z
      .string()
      .min(11, { message: "Contact number must be at least 11 digits." })
      .max(14, { message: "Contact number must not exceed 14 digits." })
      .optional(),

    address: z
      .string()
      .min(10, { message: "Address must be at least 10 characters long." })
      .max(100, { message: "Address must not exceed 100 characters." })
      .optional(),

    registrationNumber: z
      .string()
      .min(1, { message: "Registration number is required." }),

    experience: z
      .number()
      .int({ message: "Experience must be an integer." })
      .nonnegative({ message: "Experience cannot be negative." })
      .optional(),

    gender: z.enum([Gender.MALE, Gender.FEMALE], {
      message: "Invalid gender value.",
    }),

    appointmentFee: z
      .number()
      .int({ message: "Appointment fee must be an integer." })
      .nonnegative({ message: "Appointment fee cannot be negative." }),

    qualification: z
      .string()
      .min(2, { message: "Qualification must be at least 2 characters." })
      .max(30, { message: "Qualification must not exceed 30 characters." }),

    currentWorkingPlace: z
      .string()
      .min(5, {
        message: "Current working place must be at least 5 characters.",
      })
      .max(50, {
        message: "Current working place must not exceed 50 characters.",
      }),

    designation: z
      .string()
      .min(2, { message: "Designation must be at least 2 characters." })
      .max(40, { message: "Designation must not exceed 40 characters." }),
  }),

  specialties: z
    .array(z.string().uuid({ message: "Each specialty must be a valid UUID." }))
    .min(1, { message: "At least one specialty must be selected." }),
});

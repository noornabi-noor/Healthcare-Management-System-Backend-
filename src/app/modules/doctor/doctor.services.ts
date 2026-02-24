import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IDoctorUpdatePayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllDoctor = async () => {
  return await prisma.doctor.findMany({
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
};

const getDoctorById = async (doctorId: string) => {
  return await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
      appointments: {
        include: {
          patient: true,
          schedules: true,
          prescription: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      reviews: true,
    },
  });
};

const updateDoctor = async (
  doctorId: string,
  payload: IDoctorUpdatePayload,
) => {
  const existDoctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
  });

  if (!existDoctor) {
    throw new AppError(status.NOT_FOUND, "Doctor not found!");
  }

  const { doctor: doctorData, specialties } = payload;

  await prisma.$transaction(async (tx) => {
    // ✅ Update doctor basic info
    if (doctorData) {
      await tx.doctor.update({
        where: { id: doctorId },
        data: doctorData,
      });
    }

    // ✅ Handle specialties
    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {
        if (specialty.shouldDelete) {
          await tx.doctorSpecialty.delete({
            where: {
              doctorId_specialtyId: {
                doctorId,
                specialtyId: specialty.specialtyId,
              },
            },
          });
        } else {
          await tx.doctorSpecialty.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId,
                specialtyId: specialty.specialtyId,
              },
            },
            create: {
              doctorId,
              specialtyId: specialty.specialtyId,
            },
            update: {},
          });
        }
      }
    }
  });

  const doctor = await getDoctorById(doctorId);
  return doctor;
};

// const deleteDoctor = async (doctorId: string) => {
//   const existDoctor = await prisma.doctor.findUniqueOrThrow({
//     where: {
//       id: doctorId,
//     },
//   });

//   // already deleted check (optional but good practice)
//   if (existDoctor.isDeleted) {
//     // throw new Error("Doctor already deleted!");
//     throw new AppError(status.BAD_REQUEST, "Doctor already deleted!");
//   }

//   const result = await prisma.$transaction(async (tx) => {
//     // soft delete doctor
//     const deletedDoctor = await tx.doctor.update({
//       where: {
//         id: doctorId,
//       },
//       data: {
//         isDeleted: true,
//         deletedAt: new Date(),
//       },
//     });

//     // optional: also soft delete user
//     await tx.user.update({
//       where: {
//         id: existDoctor.userId,
//       },
//       data: {
//         isDeleted: true,
//         deletedAt: new Date(),
//       },
//     });

//     return deletedDoctor;
//   });
//   return result;
// };

const deleteDoctor = async (doctorId: string) => {
  const existDoctor = await prisma.doctor.findUniqueOrThrow({
    where: { id: doctorId },
  });

  // Prevent double delete
  if (existDoctor.isDeleted) {
    throw new AppError(status.BAD_REQUEST, "Doctor already deleted!");
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1️⃣ Soft delete doctor
    const deletedDoctor = await tx.doctor.update({
      where: { id: doctorId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // 2️⃣ Soft delete user + block access
    await tx.user.update({
      where: { id: existDoctor.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED, // Block login
      },
    });

    // 3️⃣ Remove active sessions (force logout)
    await tx.session.deleteMany({
      where: { userId: existDoctor.userId },
    });

    // 4️⃣ Clean relation table (optional but recommended)
    await tx.doctorSpecialty.deleteMany({
      where: { doctorId },
    });

    return deletedDoctor;
  });

  return result;
};

export const doctorServices = {
  getAllDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};

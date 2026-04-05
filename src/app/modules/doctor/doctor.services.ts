import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IDoctorUpdatePayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { IQueryParams } from "../../interface/query.interface";
import { doctorFilterableFields, doctorIncludeConfig, doctorSearchableFields } from "./doctor.constant";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Doctor, Prisma } from "../../../generated/prisma/client";

const getAllDoctor = async (query: IQueryParams) => {
  // return await prisma.doctor.findMany({
  //   include: {
  //     user: true,
  //     specialties: {
  //       include: {
  //         specialty: true,
  //       },
  //     },
  //   },
  // });
  
  const queryBuilder = new QueryBuilder<Doctor, Prisma.DoctorWhereInput, Prisma.DoctorInclude>(
    prisma.doctor,
    query,
    {
      searchableFields: doctorSearchableFields,
      filterableFields: doctorFilterableFields,
    }
  )

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      isDeleted: false,
    })
    .include({
      user: true,
      // specialties: true,
      specialties: {
        include: {
          specialty: true
        }
      },
    })
    .dynamicInclude(doctorIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  console.log(result);
  return result;
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
import { prisma } from "../../lib/prisma";
import { IDoctorUpdatePayload } from "./doctor.interface";

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
    },
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

const updateDoctor = async (
  doctorId: string,
  payload: IDoctorUpdatePayload,
) => {
  // check doctor exist
  const existDoctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
    },
  });

  // if email is being updated → check duplicate
  if (payload.email) {
    const emailExist = await prisma.user.findFirst({
      where: {
        email: payload.email,
        NOT: {
          id: existDoctor.userId,
        },
      },
    });

    if (emailExist) {
      throw new Error("User with this email already exists!");
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    // update doctor table
    const updatedDoctor = await tx.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        ...payload,
      },
    });

    // if name or email updated → update user table too
    if (payload.name || payload.email) {
      await tx.user.update({
        where: {
          id: existDoctor.userId,
        },
        data: {
          name: payload.name,
          email: payload.email,
        },
      });
    }

    // return updated doctor with relations
    const doctor = await tx.doctor.findUnique({
      where: {
        id: doctorId,
      },
      include: {
        user: true,
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });

    return doctor;
  });

  return result;
};

const deleteDoctor = async (doctorId: string) => {
  const existDoctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
    },
  });

  // already deleted check (optional but good practice)
  if (existDoctor.isDeleted) {
    throw new Error("Doctor already deleted!");
  }

  const result = await prisma.$transaction(async (tx) => {
    // soft delete doctor
    const deletedDoctor = await tx.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // optional: also soft delete user
    await tx.user.update({
      where: {
        id: existDoctor.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
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

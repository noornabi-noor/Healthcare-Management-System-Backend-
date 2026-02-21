import { Specialty } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IDoctorCreatePayload } from "./user.interface";

const createDoctor = async (payload: IDoctorCreatePayload) => {
  const specialties: Specialty[] = [];

  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: {
        id: specialtyId,
      },
    });
    if (!specialty) {
      throw new Error(`Specailty with id ${specialtyId} not found!`);
    }
    specialties.push(specialty);
  }

  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (userExist) {
    throw new Error("User with this email already exist!");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.doctor.name,
      email: payload.doctor.email,
      password: payload.password,
      needPasswordChanged: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialtiesData = specialties.map((specialty) => {
        return {
          doctorId: doctorData.id,
          specialtyId: specialty.id,
        };
      });

      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtiesData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          registrationNumber: true,
          address: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          gender: true,
          experience: true,
          appointmentFee: true,
          qualification: true,
          isDeleted: true,
          currentWorkingPlace: true,
          designation: true,
          averageRating: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
              image: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
              isDeleted: true,
              deletedAt: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  title: true,
                  id: true,
                },
              },
            },
          },
        },
      });
      return doctor;
    });
    return result;
  } catch (error) {
    console.log("Transaction error: ", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

export const userServices = {
  createDoctor,
};

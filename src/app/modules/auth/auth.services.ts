import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

interface ISignInPatientPayload {
  email: string;
  password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return patientTx;
    });

    return {
      ...data,
      patient,
    };
  } catch (error) {
    console.log("Transaction error: ", error);
    await prisma.patient.delete({
      where: {
        id: data.user.id,
      },
    });

    throw error;
  }
};

const loginPatient = async (payload: ISignInPatientPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    // throw new Error("User is blocked!");
    throw new AppError(status.BAD_REQUEST, "User is blocked!");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    // throw new Error("User is deleted!");
    throw new AppError(status.BAD_REQUEST, "User is deleted!");
  }

  return data;
};

export const authServices = {
  registerPatient,
  loginPatient,
};

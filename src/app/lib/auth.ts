import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { string } from "./../../../node_modules/zod/v4/classic/coerce";
import ms from "ms";
import { envVars } from "../config/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChanged: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },

  session: {
    expiresIn: Number(ms(Number(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN))),
    updateAge: Number(ms(Number(envVars.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE))),
    cookieCache: {
      enabled: true,
      maxAge: Number(ms(Number(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN))),
    },
  },
});

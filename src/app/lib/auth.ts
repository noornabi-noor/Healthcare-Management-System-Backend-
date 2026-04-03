import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { envVars } from "../config/env";

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  socialProviders: {
    google: {
      // enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      
      mapProfileToUser: () => {
        return {
          role: Role.PATIENT,
          status: UserStatus.ACTIVE,
          needPasswordChanged: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null,
        };
      },
    },
  },
 
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
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

    plugins: [
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({email, otp, type}) {
                if(type === "email-verification"){
                  const user = await prisma.user.findUnique({
                    where : {
                        email,
                    }
                  })
                  
                  if(user && !user.emailVerified){
                    sendEmail({
                        to : email,
                        subject : "Verify your email",
                        templateName : "otp",
                        templateData :{
                            name : user.name,
                            otp,
                        }
                    })
                  }
                }else if(type === "forget-password"){
                    const user = await prisma.user.findUnique({
                        where : {
                            email,
                        }
                    })

                    if(user){
                        sendEmail({
                            to : email,
                            subject : "Password Reset OTP",
                            templateName : "otp",
                            templateData :{
                                name : user.name,
                                otp,
                            }
                        })
                    }
                }
            },
            expiresIn : 2 * 60, // 2 minutes in seconds
            otpLength : 6,
        })
    ],

  session: {
    expiresIn: 60 * 60 * 60 * 24,
    updateAge: 60 * 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24,
    },
  },

   redirectURLs:{
        signIn : `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`,
    },

    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000", envVars.FRONTEND_URL],

  advanced: {
        // disableCSRFCheck: true,
        useSecureCookies : false,
        cookies:{
            state:{
                attributes:{
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                }
            },
            sessionToken:{
                attributes:{
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                }
            }
        }
    },
});

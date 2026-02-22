import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { envVars } from "../config/env";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interface/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from global error handler", err);
  }

  let errorSources: TErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal server error";

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message
    errorSources = [...simplifiedError.errorSources];
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    error: envVars.NODE_ENV === "development" ? err : undefined,
    errorSources,
  };

  res.status(statusCode).json(errorResponse);
};

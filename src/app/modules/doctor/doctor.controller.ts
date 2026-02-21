import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { doctorServices } from "./doctor.services";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorServices.getAllDoctor();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Get all doctor successfully!",
    data: result,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;

  const result = await doctorServices.getDoctorById(doctorId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Get doctor successfully!",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const payload = req.body;
  const result = await doctorServices.updateDoctor(doctorId as string, payload);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor profile updated successfully!",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const result = await doctorServices.deleteDoctor(doctorId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor deleted successfully!",
    data: result,
  });
});

export const doctorController = {
  getAllDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};

import { Request, Response } from "express";
import { specialtyServices } from "./specialty.services";

const createSpecialty = async(req: Request, res: Response) => {
    const payload = req.body;

    const result = await specialtyServices.createSpecialty(payload);

    res.status(201).json({
        success: true,
        message: "Specialty created successfully!",
        data: result
    });
};

export const specialtyController = {
    createSpecialty,
    
}
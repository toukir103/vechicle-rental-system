import { Request, Response } from "express";
import * as vehicleService from "./vehicles.service";

export const addVehicleController = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.addVehicle(req.body);
    res.status(201).json({ message: "Vehicle added", vehicle });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllVehiclesController = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.json({ vehicles });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getVehicleByIdController = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.getVehicleById(Number(req.params.vehicleId));
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json({ vehicle });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVehicleController = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.updateVehicle(Number(req.params.vehicleId), req.body);
    res.json({ message: "Vehicle updated", vehicle });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteVehicleController = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.deleteVehicle(Number(req.params.vehicleId));
    res.json({ message: "Vehicle deleted", vehicle });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
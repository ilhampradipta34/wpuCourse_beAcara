import { Request, Response } from "express";
import response from "../utils/response";
import RegionModel from "../models/regionModel";

export default {
  async findByCity(req: Request, res: Response) {
    try {
      const { name } = req.query;
      const result = await RegionModel.findByCity(`${name}`);
      response.success(res, result, "success get region by city name");
    } catch (error) {
      response.error(res, "failed to get region by city name" , error);
    }
  },
  async getAllProvinces(req: Request, res: Response) {
    try {
      const result = await RegionModel.getAllProvinces();
      response.success(res, result, "success get all provinces");
    } catch (error) {
      response.error(res, "failed to get all provinces", error);
    }
  },
  async getProvince(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await RegionModel.getProvince(Number(id));
      response.success(res, result, "success get a province");
    } catch (error) {
      response.error(res, "failed to get province", error);
    }
  },
  async getRegency(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await RegionModel.getRegency(Number(id));
      response.success(res, result, "success get regencies");
    } catch (error) {
      response.error(res, "failed to get regency" , error);
    }
  },
  async getDistrict(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await RegionModel.getDistrict(Number(id));
      response.success(res, result, "success get districts");
    } catch (error) {
      response.error(res, "failed to get district" , error);
    }
  },
  async getVillage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await RegionModel.getVillage(Number(id));
      response.success(res, result, "success get villages");
    } catch (error) {
      response.error(res, "failed to get village" , error);
    }
  },
};
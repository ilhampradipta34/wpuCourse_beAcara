import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import { FilterQuery, isValidObjectId } from "mongoose";
import BannerModel, { bannerDao, TypeBanner } from "../models/bannerModel";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await bannerDao.validate(req.body);
      const result = await BannerModel.create(req.body);

      response.success(res, result, "success to create a banner");
    } catch (error) {
      response.error(res, "failed to create a banner", error);
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeBanner> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await BannerModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await BannerModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        "success find all banners"
      );
    } catch (error) {
      response.error(res, "failed to find all  banners", error);
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        response.notFound(res, "failed find one banner")
      }

      const result = await BannerModel.findById(id);

      if (!result) {
        response.notFound(res, "failed find one banner")
      }


      response.success(res, result, "success find one banner");
    } catch (error) {
      response.error(res, "failed to find one banner", error);
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
              response.notFound(res, "failed to find id for update banner");
            }

      const result = await BannerModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      response.success(res, result, "success to update a banner");
    } catch (error) {
      response.error(res, "failed to update a banner", error);
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
              response.notFound(res, "failed to find id for remove banner");
            }

      const result = await BannerModel.findByIdAndDelete(id, {
        new: true,
      });

      response.success(res, result, "success remove a banner");
    } catch (error) {
      response.error(res, "failed to remove a banner", error);
    }
  },
};

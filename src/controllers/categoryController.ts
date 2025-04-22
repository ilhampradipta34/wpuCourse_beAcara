import {Response} from "express"
import { IPaginationQuery, IReqUser } from "../utils/interface"
import CategoryModel, {categoryDAO} from "../models/categoryModel"
import response from "../utils/response"





export default {

    async create(req: IReqUser, res: Response) {
        try {
            await categoryDAO.validate(req.body);
            const result = await CategoryModel.create(req.body)

            response.success(res, result, "success create a category")
        } catch (error) {
            response.error(res, "failed create category", error)
        }
    },

    async findAll(req: IReqUser, res: Response) {
        const {
            page = 1, limit = 10, search
        } = req.query as unknown as IPaginationQuery;

        try {

            const query = {};
            
            if (search) {
                Object.assign(query, {
                    $or: [
                        {
                            name: { $regex: search, $options: 'i' } 
                        },
                        {
                            description: { $regex: search, $options: 'i' }
                        }
                        
                    ]
                })
            }

            const result = await CategoryModel.find(query).limit(limit).skip((page - 1) * limit).sort({ createdAt: -1 }).exec();

            const count = await CategoryModel.countDocuments(query);

            response.pagination(res, result, {
                total: count,
                totalPages: Math.ceil(count / limit),
                current: page
            }, "success find all categories")

            
        } catch (error) {
            response.error(res, "failed find all category", error)
        }
    },

    async findOne(req: IReqUser, res: Response) {

        try {
            const { id } = req.params;

            const result = await CategoryModel.findById(id);

            response.success(res, result, "success find one category") 
        } catch (error) {
            response.error(res, "failed find one category", error)
        }
    },

    async update(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            const result = await CategoryModel.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            response.success(res, result, "success update category") 
        } catch (error) {
            response.error(res, "failed update category", error)
        }
    },


    async remove(req: IReqUser, res: Response) {
        try {
            const { id } = req.params;

            const result = await CategoryModel.findByIdAndDelete(id, {
                new: true
            });

            response.success(res, result, "success delete category") 
        } catch (error) {
            response.error(res, "failed remove category", error)
        }
    },
}
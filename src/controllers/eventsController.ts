import {Response} from "express"
import { IPaginationQuery, IReqUser } from "../utils/interface"
import response from "../utils/response"
import EventModel, { eventDAO, TEvent } from "../models/eventsModel"
import { FilterQuery } from "mongoose"





export default {
    async create (req: IReqUser, res:Response) {
        try {
            const payload = {...req.body, createdBy: req.user?.id} as TEvent;

            await eventDAO.validate(payload);

            const result = await EventModel.create(payload);

            response.success(res, result, "success create an event")
        } catch (error) {
            response.error(res, "failed to create an event", error)
        }
    },

    async findAll (req: IReqUser, res:Response) {
        try {

            const {
                limit = 10, page = 1, search
            } = req.query as unknown as IPaginationQuery;

            const query: FilterQuery<TEvent> = {};

            if (search) {
                Object.assign(query, {
                    $text: {
                        $search: search
                    }
                })
            }

            const result = await EventModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: - 1}).exec()

            const count = await EventModel.countDocuments(query);

            response.pagination(res, result, {
                current: page,
                total: count,
                totalPages: Math.ceil(count / limit)
            }, 'success fecth all events')


            
        } catch (error) {
            response.error(res, "failed to find all events", error)
        }
    },

    async findOne (req: IReqUser, res:Response) {
        try {
            const {id} = req.params;

            const result = await EventModel.findById(id);

            if (!result) {
                    response.notFound(res, "failed find one event")
                  }

            response.success(res, result, "success find one event")
        } catch (error) {
            response.error(res, "failed to find one event", error)
        }
    },


    async update (req: IReqUser, res:Response) {
        try {

            const {id} = req.params;

            //untuk slug ikut berubah jika name diupdate(not recomendeddd)
            // const payload = {...req.body}

            // if (payload.name) {
            //     const slug = payload.name.split(" ").join("-").toLowerCase();
            //     payload.slug = slug;
            //   }

            const result = await EventModel.findByIdAndUpdate(id, req.body, {
                new: true
            });

            response.success(res, result, "success update event")
            
        } catch (error) {
            response.error(res, "failed to update an event", error)
        }
    },
    async remove (req: IReqUser, res:Response) {
        try {

            const {id} = req.params;

            const result = await EventModel.findByIdAndDelete(id, {
                new: true
            });

            response.success(res, result, "success delete an event")
            
        } catch (error) {
            response.error(res, "failed to delete an event", error)
        }
    },
    async findOneBySlug (req: IReqUser, res:Response) {
        try {

            const {slug} = req.params;

            const result = await EventModel.findOne({
                slug, 
            });

            response.success(res, result, "success find one by slug an event")
            
        } catch (error) {
            response.error(res, "failed to find one by slug an event", error)
        }
    },


}
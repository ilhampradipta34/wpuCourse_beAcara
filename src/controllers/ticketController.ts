import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import TicketModel, { ticketDao, TypeTicket } from "../models/ticketModel";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await ticketDao.validate(req.body);
      const result = await TicketModel.create(req.body);

      response.success(res, result, "success create a ticket");
    } catch (error) {
      response.error(res, "failed to create a ticket", error);
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {

        const {limit = 10, page = 1, search } = req.query as unknown as IPaginationQuery
        
        const query: FilterQuery<TypeTicket> = {};

        if (search) {
            Object.assign(query,{
                ...query,
                $text : {
                    $search : search
                }
            })
        }

        const result = await TicketModel.find(query).populate("events")
        .limit(limit).skip((page -1) * limit).sort({createdAt: -1}).exec()

        const count = await TicketModel.countDocuments(query)

        response.pagination(res, result, {
            total: count,
            current: page,
            totalPages: Math.ceil(count/limit)
        }, "success find all tickets")

      
    } catch (error) {
      response.error(res, "failed to find all a ticket", error);
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findById(id);

      response.success(res, result, "success find one ticket");
    } catch (error) {
      response.error(res, "failed to find one ticket", error);
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      response.success(res, result, "success update a ticket");
    } catch (error) {
      response.error(res, "failed to update a ticket", error);
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicketModel.findByIdAndDelete(id, {
        new: true,
      });

      response.success(res, result, "success remove an ticket");
    } catch (error) {
      response.error(res, "failed to remove an ticket", error);
    }
  },

  async findAllByEvent(req: IReqUser, res: Response) {
    try {
      const { eventId } = req.params;

      if (!isValidObjectId(eventId)) {
        return response.error(res, "tickets not found", null);
      }

      const result = await TicketModel.find({ events: eventId }).exec();

      response.success(res, result, "success find all tickets by an event");
    } catch (error) {
      response.error(res, "failed to find all ticket by event", error);
    }
  },
};

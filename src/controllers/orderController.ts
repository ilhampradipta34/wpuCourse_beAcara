import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import orderModel, {
  orderDAO,
  orderStatus,
  TypeOrder,
  TypeVoucher,
} from "../models/orderModal";
import TicketModel from "../models/ticketModel";
import { FilterQuery } from "mongoose";
import { getId } from "../utils/id";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const payload = {
        ...req.body,
        createdBy: userId,
      } as TypeOrder;
      await orderDAO.validate(payload);

      const ticket = await TicketModel.findById(payload.ticket);
      if (!ticket) return response.notFound(res, "ticket not found");
      if (ticket.quantity < payload.quantity) {
        return response.error(res, "ticket quantity is not enough", null);
      }

      const total: number = +ticket?.price * +payload.quantity;

      Object.assign(payload, {
        ...payload,
        total,
      });

      const result = await orderModel.create(payload);
      
      response.success(res, result, "success to create an order");
    } catch (error) {
      response.error(res, "failed to create an order", error);
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TypeOrder> = {};

        if (filter.search) query.$text = { $search: filter.search };

        return query;
      };

      const { limit = 10, page = 1, search } = req.query;

      const query = buildQuery({
        search,
      });

      const result = await orderModel
        .find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const count = await orderModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        "success find all orders"
      );
    } catch (error) {
      response.error(res, "failed find all orders", error);
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const result = await orderModel.findOne({
        orderId,
      });

      if (!result) return response.notFound(res, "order not found");

      response.success(res, result, "success to find one an order");
    } catch (error) {
      response.error(res, "failed to find one an order", error);
    }
  },

  async findAllByMember(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TypeOrder> = {
          createdBy: userId,
        };

        if (filter.search) query.$text = { $search: filter.search };

        return query;
      };

      const { limit = 10, page = 1, search } = req.query;

      const query = buildQuery({
        search,
      });

      const result = await orderModel
        .find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const count = await orderModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        "success find all orders"
      );
    } catch (error) {
      response.error(res, "failed find all orders", error);
    }
  },

  async complete(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      const order = await orderModel.findOne({
        orderId,
        createdBy: userId,
      });

      if (!order) return response.notFound(res, "order not found");

      if (order.status === orderStatus.COMPLETED)
        return response.error(res, "you have been completed this order", null);

      const vouchers: TypeVoucher[] = Array.from(
        { length: order.quantity },
        () => {
          return {
            isPrint: false,
            voucherId: getId(),
          } as TypeVoucher;
        }
      );

      const result = await orderModel.findOneAndUpdate(
        {
          orderId,
          createdBy: userId,
        },
        {
          vouchers,
          status: orderStatus.COMPLETED,
        },
        {
          new: true,
        }
      );

      const ticket = await TicketModel.findById(order.ticket);
      if (!ticket) return response.notFound(res, "ticket and order not found");

      await TicketModel.updateOne(
        {
          _id: ticket._id,
        },
        {
          quantity: ticket.quantity - order.quantity,
        }
      );

      response.success(res, result, "success to complete an order");
    } catch (error) {
      response.error(res, "failed to complete an order", error);
    }
  },

  async pending(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await orderModel.findOne({
        orderId,
      });

      if (!order) return response.notFound(res, "order not found");

      if (order.status === orderStatus.COMPLETED) {
        return response.error(res, "this order has been completed", null);
      }

      if (order.status === orderStatus.PENDING) {
        return response.error(
          res,
          "this order currently in payment pending",
          null
        );
      }

      const result = await orderModel.findOneAndUpdate(
        { orderId },
        {
          status: orderStatus.PENDING,
        },
        {
          new: true,
        }
      );

      response.success(res, result, "success to pending an order");
    } catch (error) {
      response.error(res, "failed to pending an order", error);
    }
  },

  async cancelled(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await orderModel.findOne({
        orderId,
      });

      if (!order) return response.notFound(res, "order not found");

      if (order.status === orderStatus.COMPLETED) {
        return response.error(res, "this order has been completed", null);
      }

      if (order.status === orderStatus.CANCELLED) {
        return response.error(
          res,
          "this order currently in payment cancelled",
          null
        );
      }

      const result = await orderModel.findOneAndUpdate(
        { orderId },
        {
          status: orderStatus.CANCELLED,
        },
        {
          new: true,
        }
      );

      response.success(res, result, "success to cancelled an order");
    } catch (error) {
      response.error(res, "failed to cancelled an order", error);
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const result = await orderModel.findOneAndDelete(
        {
          orderId,
        },
        {
          new: true,
        }
      );

      if (!result) {
        return response.notFound(res, "order not found");
      }

      response.success(res, result, "success to remove an order");
    } catch (error) {
      response.error(res, "failed to remove an order", error);
    }
  },
};

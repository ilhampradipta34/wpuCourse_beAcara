import  * as Yup from "yup";
import { Response } from "express";

type Pagination = {
    totalPage: number,
    current: number,
    total: number
}

export default {

    success (res: Response, data: any, message: string){
        res.status(200).json({
            meta: {
                status: 200,
                message,
            },
            data,
        })
    },

    error (res: Response, message: string, error: unknown, customErrors?: any[]){
        if (error instanceof Yup.ValidationError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    message,
                },
                data: error.errors
            })
           
        }
        if (customErrors) {
            return res.status(400).json({
              meta: { status: 400, message },
              data: customErrors, // object[]
            });
          }
    },

    unauthorized (res: Response, message: string = 'unauthorized'){
        res.status(403).json({
            meta: {
                status: 403,
                message,

            },
            data: null
        })
    },
    pagination (res: Response, data: any[], pagination: Pagination, message: string){
        res.status(200).json({
            meta: {
                status: 200,
                message,
            },
            data,
            pagination,
        })
    },
}
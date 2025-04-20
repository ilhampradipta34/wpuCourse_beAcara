import {Response} from "express";
import { IReqUser } from "../utils/interface";
import uploader from "../utils/uploader";
import response from "../utils/response";



export default {
    async single(req: IReqUser, res:Response ){
        if (!req.file) {
            // return res.status(400).json({
            //     data: null,
            //     message: "File is not exist"
            // })
            return response.error(res, 'file is not exist', null)
        }

        try {
            const result = await uploader.uploadSingle(req.file as Express.Multer.File)

            // res.status(200).json({
            //     data: result,
            //     message: "File uploaded successfully"
            // })
            response.success(res, result, 'File uploaded successfully')

        } catch  {
            // res.status(500).json({
            //     data: null,
            //     message: "Failed upload a file"
            // })
            response.error(res, 'Failed upload a file', null)
        }
    },

    async multiple(req: IReqUser, res:Response ){
        if (!req.files || req.files.length === 0) {
            // return res.status(400).json({
            //     data: null,
            //     message: "File is not exist"
            // })
            return response.error(res, 'file is not exist', null)
        }

        try {
            const result = await uploader.uploadMultiple(req.files as Express.Multer.File[])

            // res.status(200).json({
            //     data: result,
            //     message: "Files uploaded successfully"
            // })

            response.success(res, result, 'File uploaded successfully')

        } catch  {
            // res.status(500).json({
            //     data: null,
            //     message: "Failed upload a file"
            // })
            response.error(res, 'Failed upload a file', null)
        }
    },


    async remove(req: IReqUser, res:Response ){
        try {
            const {fileUrl} = req.body as {fileUrl: string} ;

            const result = await uploader.remove(fileUrl)

            // res.status(200).json({
            //     data: result,
            //     message: "Files remove successfully"
            // })
            response.success(res, result, 'File removed successfully')
        } catch  {
            // res.status(500).json({
            //     data: null,
            //     message: "Failed remove file"
            // })
            response.error(res, 'Failed remove file', null)
        }
    }
}
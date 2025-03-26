import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/userModel";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middleware/middleware";

type TRegister = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;

}

const registerValidation = Yup.object({
  fullName: Yup.string().required(),
  userName: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), ""], "Password must be matched or passowrd not match"),
});

export default {
  async register(req: Request, res: Response) {
    const { fullName, userName, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
        await registerValidation.validate({
            fullName,
            userName,
            email,
            password,
            confirmPassword,
        });

        const result = await UserModel.create({
          fullName,
          userName,
          email,
          password,
        })

        res.status(200).json({
            message: "Berhasil mendaftar!",
            data: result,
        });
    } catch (error) {
        const err = error as unknown as Error;

        res.status(400).json({
            message: err.message,
            data: null,
        });
    }
  },

  async login(req: Request, res: Response){
    const {
      identifier, password
    } = req.body as unknown as TLogin;
    try {
      
      //ambil data user berdasarkan identifier => email dan username

      const userByIdentifier = await UserModel.findOne({
        $or: [
          { email: identifier },
          { userName: identifier },
        ],
      })
      
      if (!userByIdentifier) {
        return res.status(403).json({
          message: "user not found",
          data: null
        })
      }

      //validasi password
      const validatepassword: boolean = encrypt(password) === userByIdentifier.password;

      if (!validatepassword){
        return res.status(403).json({
          message: "user not found",
          data: null
        })
      }

      const token = generateToken({
        id: userByIdentifier.id,
        role: userByIdentifier.role,
      })

      res.status(200).json({
        message: "Berhasil login!",
        data: {
          token: token,
        },
      })


    } catch (error) {
      const err = error as unknown as Error;

      res.status(400).json({
          message: err.message,
          data: null,
      });
    }
  },

  async me(req:IReqUser, res:Response){
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      res.status(200).json({
        messsage: "sukses mendapatkan profil user!",
        data: result,
      })
    } catch (error) {
      const err = error as unknown as Error;

      res.status(400).json({
          message: err.message,
          data: null,
      });
    }
  }
};

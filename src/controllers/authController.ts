import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/userModel";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

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
};

// const registerValidation = Yup.object({
//   fullName: Yup.string().required(),
//   userName: Yup.string().required(),
//   email: Yup.string().required(),
//   password: Yup.string().required().min(6, "Password must be at least 6 characters").test('at-least-one-uppercase-letter', "Contains at least one uppercase letter", (value) => {
//     if (!value) {
//       return false;
//     }

//     const regex = /^(?=.*[A-Z])/;

//     return regex.test(value);
//   }).test('at-least-one-number', "Contains at least one number", (value) => {
//     if (!value) {
//       return false;
//     }

//     const regex = /^(?=.*\d)/;

//     return regex.test(value);
//   }),
//   confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), ""], "Password must be matched or passowrd not match"),
// });

//optimal
const registerValidation = Yup.object({
  fullName: Yup.string().required("Full name is required"),

  userName: Yup.string().required("Username is required"),

  email: Yup.string()
    .email("Invalid email format") //  tambahkan validasi format email
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default {
  async register(req: Request, res: Response) {
    /**
    #swagger.tags = ['Auth']
    */

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

      // // Cek apakah email atau username sudah digunakan
      // const existingUser = await UserModel.findOne({
      //   $or: [{ email }, { userName }],
      // });

      // if (existingUser) {
      //   const errors = [];

      //   if (existingUser.email === email) {
      //     errors.push({ field: "email", message: "Email telah digunakan" });
      //   }

      //   if (existingUser.userName === userName) {
      //     errors.push({
      //       field: "userName",
      //       message: "Username telah digunakan",
      //     });
      //   }

      //   return response.error(res, "validation failed", errors);
      // }

      const result = await UserModel.create({
        fullName,
        userName,
        email,
        password,
      });

      // res.status(200).json({
      //   message: "Berhasil mendaftar!",
      //   data: result,
      // });
      response.success(res, result, "Berhasil Mendaftar");
    } catch (error) {
      // const err = error as unknown as Error;

      // res.status(400).json({
      //   message: err.message,
      //   data: null,
      // });
      response.error(res, "Gagal Mendaftar", error);
    }
  },

  async login(req: Request, res: Response) {
    /**
     
     #swagger.tags = ['Auth']
    
     #swagger.requestBody = {
      required: true,
      schema: {$ref: '#/components/schemas/LoginRequest'},
     }
     */
    const { identifier, password } = req.body as unknown as TLogin;
    try {
      //ambil data user berdasarkan identifier => email dan username

      const userByIdentifier = await UserModel.findOne({
        $or: [{ email: identifier }, { userName: identifier }],
        isActive: true,
      });

      if (!userByIdentifier) {
        // return res.status(403).json({
        //   message: "user not found",
        //   data: null,
        // });
        return response.unauthorized(res, "User Tidak Ditemukan");
      }

      //validasi password
      const validatepassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatepassword) {
        // return res.status(403).json({
        //   message: "user not found",
        //   data: null,
        // });
        return response.unauthorized(res, "User Tidak Ditemukan");
      }

      const token = generateToken({
        id: userByIdentifier.id,
        role: userByIdentifier.role,
      });

      // res.status(200).json({
      //   message: "Berhasil login!",
      //   data: {
      //     token: token,
      //   },
      // });
      response.success(res, { token }, "Berhasil login!");
    } catch (error) {
      // const err = error as unknown as Error;

      // res.status(400).json({
      //   message: err.message,
      //   data: null,
      // });
      response.error(res, "login failed", error);
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
      "bearerAuth": []

     }]
     */

    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      // res.status(200).json({
      //   messsage: "sukses mendapatkan profil user!",
      //   data: result,
      // });
      response.success(res, result, "sukses mendapatkan profil user!");
    } catch (error) {
      // const err = error as unknown as Error;

      // res.status(400).json({
      //   message: err.message,
      //   data: null,
      // });
      response.error(res, "get profile failed", error);
    }
  },

  async activation(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
      reuqired: true,
      schema: {
        $ref: '#/components/schemas/ActivationRequest'
      }
     }
     */
    try {
      const { code } = req.body as { code: string };

      const user = await UserModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          isActive: true,
        },
        {
          new: true,
        }
      );

      // res.status(200).json({
      //   message: "sukses mengaktifkan user!",
      //   data: user,
      // });
      response.success(res, user, "sukses mengaktifkan user!");
    } catch (error) {
      // const err = error as unknown as Error;

      // res.status(400).json({
      //   message: err.message,
      //   data: null,
      // });
      response.error(res, "activation failed", error);
    }
  },
};

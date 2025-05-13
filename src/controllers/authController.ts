import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel, { userDTO, userLoginDTO, userUpdatePasswordDTO } from "../models/userModel";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";



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


export default {

  async updateProfile (req: IReqUser, res: Response) {
    try {

      const userId = req.user?.id;
      const {fullName, profilePicture} = req.body;

      const result = await UserModel.findByIdAndUpdate(userId, {
        fullName, profilePicture
      }, {
        new: true
      })

      if (!result) return response.notFound(res, "user not found")

        response.success(res, result, "success to update profile")
      
    } catch (error) {
      response.error(res, "failed to update profile", error)
    }
  },

  async updatePassword (req: IReqUser, res: Response) {
     try {

      const userId = req.user?.id;
      const {oldPassword, password, confirmPassword} = req.body;

      await userUpdatePasswordDTO.validate({
        oldPassword, password, confirmPassword
      })

      const user = await UserModel.findById(userId)

      if(!user || user.password !== encrypt(oldPassword)) return response.notFound(res, "user not found")

        const result = await UserModel.findByIdAndUpdate(userId, {
          password: encrypt(password)
        }, {
          new: true
        })

        response.success(res, result, "success to upate password")
      
    } catch (error) {
      response.error(res, "failed to update password", error)
    }
  },

  async register(req: Request, res: Response) {


    const { fullName, userName, email, password, confirmPassword } =
      req.body;

    try {
      await userDTO.validate({
        fullName,
        userName,
        email,
        password,
        confirmPassword,
      });

      // // Cek apakah email atau username sudah digunakan (paralel, lebih cepat)
      // const existingUser = await UserModel.findOne({
      //   $or: [{ email }, { userName }],
      // });
    
      // if (existingUser) {
      //   return response.error(res, "Gagal mendaftar: Email atau Username telah digunakan", null);
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
    } catch (error: any) {
      // const err = error as unknown as Error;

      // res.status(400).json({
      //   message: err.message,
      //   data: null,
      // });
      // }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        const fieldName = field === "email" ? "Email" : "Username";
        // return res.status(400).json({
        //   message: `${fieldName} telah digunakan`,
        //   data: null,
        // });
        return response.error(res, "Gagal Mendaftar", null, [
          { field, message: `${fieldName} telah digunakan` }
        ])
      }

      response.error(res, "Gagal Mendaftar", error);
    }
  },

  async login(req: Request, res: Response) {

    const { identifier, password } = req.body;
    try {
      //ambil data user berdasarkan identifier => email dan username
      await userLoginDTO.validate({
        identifier, password
      })

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

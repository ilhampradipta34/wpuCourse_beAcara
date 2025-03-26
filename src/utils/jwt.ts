import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { SECRET } from "./env";

export interface IUserToken extends Omit<User, "password" 
| "activationCode" | "isActive" | "fullName" | "email" | "profilePicture" | "userName"> {
    id?: Types.ObjectId;
}


export const generateToken = (user: IUserToken): string => {
    const token = jwt.sign(user, SECRET, {
        expiresIn: "1h",
    });
    return token;
};

export const getUserData = (token: string) => {
    const user = jwt.verify(token, SECRET) as IUserToken;
    return user;
};
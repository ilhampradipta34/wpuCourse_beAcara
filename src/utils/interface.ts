
import { Request } from "express"
import { Types } from "mongoose";
import { User } from "../models/userModel";

export interface IUserToken extends Omit<User, "password" 
| "activationCode" | "isActive" | "fullName" | "email" | "profilePicture" | "userName"> {
    id?: Types.ObjectId;
}


export interface IReqUser extends Request {
    user?: IUserToken;
}

export interface IPaginationQuery {
    page: number;
    limit: number;
    search?: string;
}
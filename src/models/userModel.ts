import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { renderMailHtml, sendMail } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";
import { ROLES } from "../utils/constant";

export interface User {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<User>(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },

    userName: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      index: true, // Explicit index
    },

    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      index: true, // Explicit index
    },

    password: {
      type: Schema.Types.String,
      required: true,
    },

    role: {
      type: Schema.Types.String,
      enum: [ROLES.ADMIN, ROLES.MEMBER],
      default: ROLES.MEMBER,
    },

    profilePicture: {
      type: Schema.Types.String,
      default: "user.jpg",
    },

    isActive: {
      type: Schema.Types.Boolean,
      default: false,
    },

    activationCode: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;

  user.password = encrypt(user.password);

  user.activationCode = encrypt(user.id);

  next();
});

userSchema.post("save", async (doc, next) => {
  try {
    const user = doc;

    console.log("send email to: ", user.email);

    const contentMail = await renderMailHtml("registration-success.ejs", {
      username: user.userName,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt?.toString(),
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
    });

    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: "Aktivasi akun anda",
      html: contentMail,
    });

    
  } catch (error) {
    console.log(error)
  } finally {
    next();
  }
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.email;
  delete user.activationCode

  return user;
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

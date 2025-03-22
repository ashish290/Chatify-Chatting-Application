import { Request, Response } from "express";
import { LoginValidation, SignUpValidation, updateUser } from "../dto";
import User from "../models/UserModel";
import { GeneratePassword, GenerateSalt, GenerateSignature } from "../util";
import dotenv from "dotenv";

dotenv.config();

export const UserLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = <LoginValidation>req.body;
    if (!email || !password) {
      res.status(400).json({ required: "Email and Password is required" });
      return;
    }
    const exisitingUser = await User.findOne({ email: email });
    if (exisitingUser) {
      const ExistPassword = exisitingUser.password;
      const salt = exisitingUser.salt;
      const UserPassword = await GeneratePassword(password, salt);
      if (ExistPassword === UserPassword) {
        const signature = await GenerateSignature({
          _id: exisitingUser.id,
          email: exisitingUser.email,
        });
        res.cookie("jwt", signature, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        console.log("User logged in...");
        res.status(200).json({
          user: {
            id: exisitingUser.id,
            email: exisitingUser.email,
            profilesetup: exisitingUser.profileSetup,
            firstName: exisitingUser.firstName,
            lastName: exisitingUser.lastName,
            image: exisitingUser.image,
            color: exisitingUser.color,
          },
          success: "User LoginedIn",
          signature: signature,
        });
        return;
      } else {
        res.status(401).json({ InvalidPassword: "Wrong Password !" });
      }
    } else {
      res.status(404).json({ InvalidUser: "User Don't Exist" });
      return;
    }
  } catch (error) {
    console.log("Login Error :", error);
  }
};

export const UserSignUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = <SignUpValidation>req.body;
    const exisitingUser = await User.findOne({ email: email });
    if (!email || !password) {
      res.status(400).json({ Required: "Email and Password is required" });
      return;
    }

    if (exisitingUser) {
      res.status(409).json({ userExist: "User Alreday Exist..." });
      return;
    }

    const salt = await GenerateSalt();
    const UserPassword = await GeneratePassword(password, salt);
    const User_Schema = await User.create({
      email: email,
      password: UserPassword,
      salt: salt,
    });
    await User_Schema.save();
    if (User_Schema) {
      const signature = await GenerateSignature({
        _id: User_Schema.id,
        email: User_Schema.email,
      });
      res.cookie("jwt", signature, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      res.status(201).json({
        user: {
          id: User_Schema.id,
          email: User_Schema.email,
          profilesetup: User_Schema.profileSetup,
        },
        success: "done",
      });
    }
  } catch (error) {
    console.log("SignUp Error :", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const GetUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (user) {
      const existingUser = await User.findById(user._id);
      if (existingUser) {
        res.status(200).json({
          id: existingUser._id,
          email: existingUser.email,
          profilesetup: existingUser.profileSetup,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          image: existingUser.image,
          color: existingUser.color,
        });
      }
    } else {
      res.status(400).json({ msg: "User is not found" });
      return;
    }
  } catch (error) {
    console.error({ error });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const user_id = req.user._id;
    const { firstName, lastName, color } = <updateUser>req.body;
    if (!firstName || !lastName) {
      res.status(400).json({ filedError: "All field requried." });
      return;
    }
    const userData = await User.findByIdAndUpdate(
      user_id,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    console.log("userData from profile", userData) 
    res.status(200).json({
      id: userData?._id,
      email: userData?.email,
      profilesetup: userData?.profileSetup,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      image: userData?.image,
      color: userData?.color,
      success: "User Created Successfully...",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const AddProfile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ imgError: "File is required." });
      return;
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { image: `uploads/profiles/${req.file.filename}`},
      { new: true, runValidators: true }
    );

    res.status(200).json({
      image: updateUser?.image,
      success: "Image updated successfully...",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
export const removeProfileImage = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    console.log(user);
    if (!user) {
      res.status(404).json({ msg: "User not found!" });
      return;
    }
    if (user.image) {
      user.image = null;
    }
    await user.save();
    res.status(200).json({ success: "Profile image removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const UserLogout = async (req: Request, res: Response) => {
  try {
    if (res) {
      res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "none" });
      res.status(200).json({ success: "User Logout Successfully..." });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

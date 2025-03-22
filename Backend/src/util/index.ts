import { Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { AuthSignature } from "../dto";

dotenv.config();
const key: string = process.env.Key!;

export const GenerateSalt = async () => {
  return await bcrypt.genSalt(10);
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const GenerateSignature = async (payload: AuthSignature) => {
  return jwt.sign(payload, key, {
    expiresIn: "10d",
  });
};

export const validateSignature = async (req: Request) => {
  try {
    const signature = req.cookies.jwt;
    if(!signature) return false;
    const payload = jwt.verify(signature, key) as AuthSignature;
    if(payload) {
        req.user = payload;
        return true;
    }
  } catch (error) {
    console.log("ValidateSignature Error:", error);
  }
};

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Database from "./service/Database";
import Express from "./service/Express";
import cookieParser from "cookie-parser";
import { setupSocket } from "./socket";

dotenv.config();

try {
  const StartServer = async () => {
    const app = express();
    const PORT = process.env.PORT;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors());
    app.use('/uploads/profiles', express.static('uploads/profiles'));
    app.use('/uploads/files', express.static('uploads/files'));

    await Database();
    await Express(app);

    const server = app.listen(PORT, () => {
      console.log(`Server is running on : ${PORT}`);
    });
    setupSocket(server);
  };
  StartServer();
} catch (error) {
  console.log("Server Error :", error);
}
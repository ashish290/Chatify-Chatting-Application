import { Request, Response, Application } from "express";
import { AuthRoutes, ChannelRoutes, ContactRoutes, MessageRoutes } from "../routes/index";

export default async (app: Application) => {
  try {
    app.use("/auth",AuthRoutes);
    app.use("/contact",ContactRoutes); 
    app.use("/message",MessageRoutes);
    app.use("/channel",ChannelRoutes);

    app.use("/", (req: Request, res: Response) => {
      res.json({ msg: "Express working..." });
    });

  } catch (error) {
    console.log("Express Error :", error);
  }
};
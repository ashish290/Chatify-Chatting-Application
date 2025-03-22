import { Request, Response } from "express";
import Message from "../models/MessageModel";
import { mkdirSync, rename, renameSync } from "fs";

export const getMessage = async (req: Request, res: Response) => {
  try {
    const user1 = req.user._id;
    const user2 = req.body.id;
    if (!user1 || !user2) { 
      res.status(400).send("Both user ID's are required");
      return;
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if(!req.file) {
      res.status(400).send("File is required");
      return;
    }

    res.status(200).json({filePath : `uploads/files/${req.file.filename}` });
    return;

  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};

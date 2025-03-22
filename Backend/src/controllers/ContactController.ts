import { Request, Response, NextFunction } from "express";
import { SearchUserInputs } from "../dto";
import User from "../models/UserModel";
import mongoose from "mongoose";
import Message from "../models/MessageModel";

export const SearchContacts = async (req: Request, res: Response) => {
  try {
    const { user } = <SearchUserInputs>req.body;
    if (user === null || user === undefined) {
      res.json({ error: "Required Input!" });
      return;
    }

    const sanitizedSearchTerm = user.replace(/[.*+?${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contact = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    res.status(200).json({ contact });
    return;
  } catch (error) {
    console.log("Error occurred:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const getContactDMList = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    console.log("UserId",userId);
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: {
          lastMessageTime: -1,
        },
      },
    ]);

    res.status(200).json({ contacts });
  } catch (error) {
    console.log(`DmList Error : ${error}`);
    res.status(500).send(`Internal Server Error :${error}`);
    return;
  }
};

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const users = await User.find({
      _id : {$ne : req.user._id}},
      "firstName lastName _id email"
    );
    const contacts = users.map((user) => ({
      label : user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value : user._id,
    }));
    res.status(200).json({contacts});
    return;
  } catch (error) {
    console.log("Error occurred:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
};
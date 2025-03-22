import { Request, Response } from "express";
import { ChannelInput } from "../dto";
import User from "../models/UserModel";
import Channel from "../models/ChannelModel";
import mongoose from "mongoose";

export const CreateChannel = async (req: Request, res: Response) => {
  try {
    const { name, members } = <ChannelInput>req.body;
    const user = req.user._id;

    const admin = await User.findById(user);
    if (!admin) {
      res.status(400).json({ AdminError: "Admin user not found" });
      return;
    }
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      res.status(400).json({ MemberError: "Some member are not valid users" });
    }

    const newChannel = new Channel({
      name,
      members,
      admin: user,
    });
    await newChannel.save();

    res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error");
    return;
  }
};

export const getUserChannels = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const channels = await Channel.find({
      $or : [{admin : userId},{members : userId}],
    }).sort({updatedAt : -1});

    res.status(200).json({channels});
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).send("Internal Server Error"); 
    return;
  }
};
 
export const getChannelMessages = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    console.log(channelId);

    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });

    console.log(channel);

    if (!channel) {
      res.status(404).json({ error: "Channel not found" });
      return;
    }

    const messages = channel.messages;
    res.status(200).json({ messages });
    return;

  } catch (error) {
    console.error("Error fetching channel messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

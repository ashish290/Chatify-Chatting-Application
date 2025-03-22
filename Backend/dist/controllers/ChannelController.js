"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelMessages = exports.getUserChannels = exports.CreateChannel = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const ChannelModel_1 = __importDefault(require("../models/ChannelModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const CreateChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, members } = req.body;
        const user = req.user._id;
        const admin = yield UserModel_1.default.findById(user);
        if (!admin) {
            res.status(400).json({ AdminError: "Admin user not found" });
            return;
        }
        const validMembers = yield UserModel_1.default.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            res.status(400).json({ MemberError: "Some member are not valid users" });
        }
        const newChannel = new ChannelModel_1.default({
            name,
            members,
            admin: user,
        });
        yield newChannel.save();
        res.status(201).json({ channel: newChannel });
    }
    catch (error) {
        console.log({ error });
        res.status(500).send("Internal Server Error");
        return;
    }
});
exports.CreateChannel = CreateChannel;
const getUserChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const channels = yield ChannelModel_1.default.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ updatedAt: -1 });
        res.status(200).json({ channels });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).send("Internal Server Error");
        return;
    }
});
exports.getUserChannels = getUserChannels;
const getChannelMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { channelId } = req.params;
        console.log(channelId);
        const channel = yield ChannelModel_1.default.findById(channelId).populate({
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
    }
    catch (error) {
        console.error("Error fetching channel messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
});
exports.getChannelMessages = getChannelMessages;

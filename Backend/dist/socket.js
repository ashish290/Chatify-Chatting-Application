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
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const MessageModel_1 = __importDefault(require("./models/MessageModel"));
const ChannelModel_1 = __importDefault(require("./models/ChannelModel"));
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    const userSocketMap = new Map();
    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
            }
        }
    };
    const sendMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
        const createdMessage = yield MessageModel_1.default.create(message);
        const messaegeData = yield MessageModel_1.default.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");
        console.log("MessageData", messaegeData);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messaegeData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messaegeData);
        }
    });
    const sendChannelMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        const { channelId, sender, content, messageType, fileUrl } = message;
        const createdMessage = yield MessageModel_1.default.create({
            sender,
            recipient: null,
            content,
            messageType,
            timeStamp: new Date(),
            fileUrl,
        });
        const messageData = yield MessageModel_1.default.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .exec();
        if (!messageData) {
            throw new Error("Message not found after creation");
        }
        yield ChannelModel_1.default.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id },
        });
        const channel = yield ChannelModel_1.default.findById(channelId).populate("members");
        const finalData = Object.assign(Object.assign({}, messageData.toObject()), { channelId: channel === null || channel === void 0 ? void 0 : channel._id });
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("recieve-channel-message", finalData);
                }
            });
            if (channel.admin) {
                const adminSocketId = userSocketMap.get(channel.admin.toString());
                if (adminSocketId) {
                    io.to(adminSocketId).emit("recieve-channel-message", finalData);
                }
            }
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.id;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        }
        else {
            console.log("User Id not provided during connection.");
        }
        socket.on("sendMessage", sendMessage);
        socket.on("send-channel-message", sendChannelMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};
exports.setupSocket = setupSocket;

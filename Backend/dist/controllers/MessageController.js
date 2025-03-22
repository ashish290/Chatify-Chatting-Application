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
exports.uploadFile = exports.getMessage = void 0;
const MessageModel_1 = __importDefault(require("../models/MessageModel"));
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user1 = req.user._id;
        const user2 = req.body.id;
        if (!user1 || !user2) {
            res.status(400).send("Both user ID's are required");
            return;
        }
        const messages = yield MessageModel_1.default.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 });
        res.status(200).json({ messages });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).send("Internal Server Error");
        return;
    }
});
exports.getMessage = getMessage;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).send("File is required");
            return;
        }
        res.status(200).json({ filePath: `uploads/files/${req.file.filename}` });
        return;
    }
    catch (error) {
        console.log({ error });
        res.status(500).send("Internal Server Error");
        return;
    }
});
exports.uploadFile = uploadFile;

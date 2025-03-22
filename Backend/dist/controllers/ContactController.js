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
exports.getAllContacts = exports.getContactDMList = exports.SearchContacts = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const MessageModel_1 = __importDefault(require("../models/MessageModel"));
const SearchContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        if (user === null || user === undefined) {
            res.json({ error: "Required Input!" });
            return;
        }
        const sanitizedSearchTerm = user.replace(/[.*+?${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(sanitizedSearchTerm, "i");
        const contact = yield UserModel_1.default.find({
            $and: [
                { _id: { $ne: req.user._id } },
                {
                    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
                },
            ],
        });
        res.status(200).json({ contact });
        return;
    }
    catch (error) {
        console.log("Error occurred:", error);
        res.status(500).send("Internal Server Error");
        return;
    }
});
exports.SearchContacts = SearchContacts;
const getContactDMList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        console.log("UserId", userId);
        const contacts = yield MessageModel_1.default.aggregate([
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
    }
    catch (error) {
        console.log(`DmList Error : ${error}`);
        res.status(500).send(`Internal Server Error :${error}`);
        return;
    }
});
exports.getContactDMList = getContactDMList;
const getAllContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserModel_1.default.find({
            _id: { $ne: req.user._id }
        }, "firstName lastName _id email");
        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id,
        }));
        res.status(200).json({ contacts });
        return;
    }
    catch (error) {
        console.log("Error occurred:", error);
        res.status(500).send("Internal Server Error");
        return;
    }
});
exports.getAllContacts = getAllContacts;

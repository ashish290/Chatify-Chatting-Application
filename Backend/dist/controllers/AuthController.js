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
exports.UserLogout = exports.removeProfileImage = exports.AddProfile = exports.UpdateUser = exports.GetUser = exports.UserSignUp = exports.UserLogin = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const util_1 = require("../util");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const UserLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ required: "Email and Password is required" });
            return;
        }
        const exisitingUser = yield UserModel_1.default.findOne({ email: email });
        if (exisitingUser) {
            const ExistPassword = exisitingUser.password;
            const salt = exisitingUser.salt;
            const UserPassword = yield (0, util_1.GeneratePassword)(password, salt);
            if (ExistPassword === UserPassword) {
                const signature = yield (0, util_1.GenerateSignature)({
                    _id: exisitingUser.id,
                    email: exisitingUser.email,
                });
                res.cookie("jwt", signature, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                });
                console.log("User logged in...");
                res.status(200).json({
                    user: {
                        id: exisitingUser.id,
                        email: exisitingUser.email,
                        profilesetup: exisitingUser.profileSetup,
                        firstName: exisitingUser.firstName,
                        lastName: exisitingUser.lastName,
                        image: exisitingUser.image,
                        color: exisitingUser.color,
                    },
                    success: "User LoginedIn",
                    signature: signature,
                });
                return;
            }
            else {
                res.status(401).json({ InvalidPassword: "Wrong Password !" });
            }
        }
        else {
            res.status(404).json({ InvalidUser: "User Don't Exist" });
            return;
        }
    }
    catch (error) {
        console.log("Login Error :", error);
    }
});
exports.UserLogin = UserLogin;
const UserSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const exisitingUser = yield UserModel_1.default.findOne({ email: email });
        if (!email || !password) {
            res.status(400).json({ Required: "Email and Password is required" });
            return;
        }
        if (exisitingUser) {
            res.status(409).json({ userExist: "User Alreday Exist..." });
            return;
        }
        const salt = yield (0, util_1.GenerateSalt)();
        const UserPassword = yield (0, util_1.GeneratePassword)(password, salt);
        const User_Schema = yield UserModel_1.default.create({
            email: email,
            password: UserPassword,
            salt: salt,
        });
        yield User_Schema.save();
        if (User_Schema) {
            const signature = yield (0, util_1.GenerateSignature)({
                _id: User_Schema.id,
                email: User_Schema.email,
            });
            res.cookie("jwt", signature, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });
            res.status(201).json({
                user: {
                    id: User_Schema.id,
                    email: User_Schema.email,
                    profilesetup: User_Schema.profileSetup,
                },
                success: "done",
            });
        }
    }
    catch (error) {
        console.log("SignUp Error :", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});
exports.UserSignUp = UserSignUp;
const GetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const existingUser = yield UserModel_1.default.findById(user._id);
            if (existingUser) {
                res.status(200).json({
                    id: existingUser._id,
                    email: existingUser.email,
                    profilesetup: existingUser.profileSetup,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    image: existingUser.image,
                    color: existingUser.color,
                });
            }
        }
        else {
            res.status(400).json({ msg: "User is not found" });
            return;
        }
    }
    catch (error) {
        console.error({ error });
    }
});
exports.GetUser = GetUser;
const UpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user._id;
        const { firstName, lastName, color } = req.body;
        if (!firstName || !lastName) {
            res.status(400).json({ filedError: "All field requried." });
            return;
        }
        const userData = yield UserModel_1.default.findByIdAndUpdate(user_id, {
            firstName,
            lastName,
            color,
            profileSetup: true,
        }, { new: true, runValidators: true });
        console.log("userData from profile", userData);
        res.status(200).json({
            id: userData === null || userData === void 0 ? void 0 : userData._id,
            email: userData === null || userData === void 0 ? void 0 : userData.email,
            profilesetup: userData === null || userData === void 0 ? void 0 : userData.profileSetup,
            firstName: userData === null || userData === void 0 ? void 0 : userData.firstName,
            lastName: userData === null || userData === void 0 ? void 0 : userData.lastName,
            image: userData === null || userData === void 0 ? void 0 : userData.image,
            color: userData === null || userData === void 0 ? void 0 : userData.color,
            success: "User Created Successfully...",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.UpdateUser = UpdateUser;
const AddProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ imgError: "File is required." });
            return;
        }
        const updateUser = yield UserModel_1.default.findByIdAndUpdate(req.user._id, { image: `uploads/profiles/${req.file.filename}` }, { new: true, runValidators: true });
        res.status(200).json({
            image: updateUser === null || updateUser === void 0 ? void 0 : updateUser.image,
            success: "Image updated successfully...",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.AddProfile = AddProfile;
const removeProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(req.user._id);
        console.log(user);
        if (!user) {
            res.status(404).json({ msg: "User not found!" });
            return;
        }
        if (user.image) {
            user.image = null;
        }
        yield user.save();
        res.status(200).json({ success: "Profile image removed successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.removeProfileImage = removeProfileImage;
const UserLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res) {
            res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "none" });
            res.status(200).json({ success: "User Logout Successfully..." });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.UserLogout = UserLogout;

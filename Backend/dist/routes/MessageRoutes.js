"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
const express_1 = require("express");
const CommonAuth_1 = require("../middleware/CommonAuth");
const controllers_1 = require("../controllers");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
exports.MessageRoutes = router;
const PhotosPath = path_1.default.resolve(__dirname, "../../uploads/files");
fs_1.default.mkdirSync("uploads/profiles", { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PhotosPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post("/get-messages", CommonAuth_1.Authenticate, controllers_1.getMessage);
router.post("/upload-file", CommonAuth_1.Authenticate, upload.single("file"), controllers_1.uploadFile);

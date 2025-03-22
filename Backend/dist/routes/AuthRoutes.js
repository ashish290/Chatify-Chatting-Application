"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const CommonAuth_1 = require("../middleware/CommonAuth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
exports.AuthRoutes = router;
const PhotosPath = path_1.default.resolve(__dirname, "../../uploads/profiles");
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
router.post("/signup", controllers_1.UserSignUp);
router.post("/login", controllers_1.UserLogin);
router.get("/user-info", CommonAuth_1.Authenticate, controllers_1.GetUser);
router.post("/update-profile", CommonAuth_1.Authenticate, controllers_1.UpdateUser);
router.post("/add-profile", CommonAuth_1.Authenticate, upload.single("profile-image"), controllers_1.AddProfile);
router.delete("/remove-profile-img", CommonAuth_1.Authenticate, controllers_1.removeProfileImage);
router.post("/logout", controllers_1.UserLogout);
router.use("/", (req, res) => {
    res.json({ msg: "AuthRouter working..." });
});

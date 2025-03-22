import { Router, Request, Response } from "express";
import {
  AddProfile,
  GetUser,
  removeProfileImage,
  UpdateUser,
  UserLogin,
  UserLogout,
  UserSignUp,
} from "../controllers";
import { Authenticate } from "../middleware/CommonAuth";
import multer from "multer";
import path from "path";
import fs from 'fs';

const router = Router();
const PhotosPath = path.resolve(__dirname, "../../uploads/profiles");

fs.mkdirSync("uploads/profiles", { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PhotosPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post("/signup", UserSignUp);
router.post("/login", UserLogin);
router.get("/user-info", Authenticate, GetUser);
router.post("/update-profile", Authenticate, UpdateUser);
router.post(
  "/add-profile",
  Authenticate,
  upload.single("profile-image"),
  AddProfile
);
router.delete("/remove-profile-img", Authenticate, removeProfileImage);
router.post("/logout", UserLogout);

router.use("/", (req: Request, res: Response) => {
  res.json({ msg: "AuthRouter working..." });
});

export { router as AuthRoutes };

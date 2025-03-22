import { Router } from "express";
import { Authenticate } from "../middleware/CommonAuth";
import { getMessage, uploadFile } from "../controllers";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();
const PhotosPath = path.resolve(__dirname, "../../uploads/files");

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

router.post("/get-messages", Authenticate, getMessage);
router.post("/upload-file", Authenticate, upload.single("file"), uploadFile);

export { router as MessageRoutes };
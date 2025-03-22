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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../routes/index");
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.use("/auth", index_1.AuthRoutes);
        app.use("/contact", index_1.ContactRoutes);
        app.use("/message", index_1.MessageRoutes);
        app.use("/channel", index_1.ChannelRoutes);
        app.use("/", (req, res) => {
            res.json({ msg: "Express working..." });
        });
    }
    catch (error) {
        console.log("Express Error :", error);
    }
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_path_1 = require("node:path");
const app = (0, express_1.default)();
const publicDir = (0, node_path_1.resolve)(process.cwd(), "public");
app.use("/assets", express_1.default.static((0, node_path_1.resolve)(publicDir, "assets")));
app.use("/api", express_1.default.static((0, node_path_1.resolve)(publicDir, "api")));
app.get("/", (req, res) => {
    res.sendFile((0, node_path_1.resolve)(publicDir, "./index.html"));
});
app.listen(3000, () => {
    console.log("Listening on http:localhost:3000/");
});

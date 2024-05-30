"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_path_1 = require("node:path");
const global_1 = require("./global");
const app = (0, express_1.default)();
app.use("/assets", express_1.default.static((0, node_path_1.resolve)(global_1.PUBLIC_DIR, "assets")));
app.use("/api", express_1.default.static((0, node_path_1.resolve)(global_1.PUBLIC_DIR, "api")));
app.get("/", (req, res) => {
    res.sendFile((0, node_path_1.resolve)(global_1.PUBLIC_DIR, "./index.html"));
});
app.listen(3000, () => {
    console.log("Listening on http:localhost:3000/");
});

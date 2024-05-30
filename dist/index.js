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
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const imagescript_1 = require("imagescript");
const global_1 = require("./global");
var Category;
(function (Category) {
    Category["ITEMS"] = "items";
    Category["ENTITIES"] = "entities";
})(Category || (Category = {}));
class MinecraftIconsTools {
    reloadData(dataRawFilePaths = [], sprite = []) {
        return new Promise((resv) => {
            // const data = MinecraftIconsTools.parseRaw(dataRaw)
            const data = MinecraftIconsTools.joinRaws(dataRawFilePaths);
            const sortedData = MinecraftIconsTools.sortedByIdAndSubId(data);
            const mappedData = MinecraftIconsTools.toMap(sortedData);
            (0, node_fs_1.writeFileSync)((0, node_path_1.resolve)(global_1.ASSETS_DIR, "data.json"), JSON.stringify(sortedData), { encoding: "utf-8" });
            (0, node_fs_1.writeFileSync)((0, node_path_1.resolve)(global_1.ASSETS_DIR, "data.map.json"), JSON.stringify(mappedData), { encoding: "utf-8" });
            (0, node_fs_1.writeFileSync)((0, node_path_1.resolve)(global_1.ASSETS_DIR, "data.map.js"), MinecraftIconsTools.mapToJSFile(mappedData), { encoding: "utf-8" });
            MinecraftIconsTools.exportIcons(sortedData, sprite).then(() => {
                resv();
            });
        });
    }
    static joinRaws(dataRawFilePaths) {
        const allData = [];
        for (const path of dataRawFilePaths) {
            try {
                const dataRaw = JSON.parse((0, node_fs_1.readFileSync)(path, { encoding: "utf-8" }));
                if (!Array.isArray(dataRaw))
                    throw new Error(`Raw file ${path} must be array`);
                allData.push(...dataRaw);
            }
            catch (e) {
                console.error(`Can not parse raw file ${path}`, e);
            }
        }
        return allData;
    }
    static sortedByIdAndSubId(data) {
        return data.sort((itemA, itemB) => {
            return (itemA.id * 10 + itemA.subId) - (itemB.id * 10 + itemB.subId);
        });
    }
    static toMap(data) {
        const dataMap = {};
        data.forEach(item => {
            const id = `${item.category}-${item.id}-${item.subId}`;
            dataMap[id] = Object.assign({}, item);
        });
        return dataMap;
    }
    static mapToJSFile(dataMap, exportVariableName = "DATA", constant = true) {
        return `${constant ? "const" : "let"} ${exportVariableName} = ${JSON.stringify(dataMap)};`;
    }
    static exportIcons(dataJson_1) {
        return __awaiter(this, arguments, void 0, function* (dataJson, sprites = []) {
            return new Promise((resv) => __awaiter(this, void 0, void 0, function* () {
                for (let sprite of sprites) {
                    sprite.buffer = (0, node_fs_1.readFileSync)(sprite.path);
                    sprite.image = yield imagescript_1.Image.decode(sprite.buffer);
                    if (!sprite.outDirPath) {
                        sprite.outDirPath = (0, node_path_1.resolve)(global_1.API_DIR, sprite.category);
                    }
                    if (!(0, node_fs_1.existsSync)(sprite.outDirPath))
                        (0, node_fs_1.mkdirSync)(sprite.outDirPath, { recursive: true });
                }
                dataJson.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const sprite = sprites.find((s) => s.category === data.category);
                    if (!sprite)
                        return console.error(`Can not get sprite for category ${data.category}`);
                    const fileName = (0, global_1.getFilename)(data.category, data.id, data.subId);
                    let icon = (_a = sprite.image) === null || _a === void 0 ? void 0 : _a.clone();
                    icon = icon.crop(data.x * -1, data.y * -1, sprite.width, sprite.height);
                    const bufferIcon = yield (icon === null || icon === void 0 ? void 0 : icon.encode(1).catch(e => {
                        console.error(`Can not encode icon ${fileName}`, e);
                    }));
                    if (!bufferIcon)
                        return console.error(`Can not export icon ${fileName}`);
                    (0, node_fs_1.writeFileSync)((0, node_path_1.resolve)(sprite.outDirPath, fileName), bufferIcon);
                }));
            }));
        });
    }
}
if (process.argv[2].indexOf("--reload-data") !== -1) {
    const minecraftIconsTools = new MinecraftIconsTools();
    minecraftIconsTools.reloadData([
        (0, node_path_1.resolve)(global_1.ASSETS_DIR, "data_raw_items.json"),
        (0, node_path_1.resolve)(global_1.ASSETS_DIR, "data_raw_entities.json"),
    ], [
        {
            category: Category.ITEMS,
            path: (0, node_path_1.resolve)(global_1.ASSETS_DIR, "items-28.png"),
            height: 32,
            width: 32
        },
        {
            category: Category.ENTITIES,
            path: (0, node_path_1.resolve)(global_1.ASSETS_DIR, "entities-28.png"),
            height: 32,
            width: 32
        }
    ]);
}

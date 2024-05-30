import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import { Image } from "imagescript"

import { API_DIR, ASSETS_DIR, getFilename } from "./global"

enum Category {
    ITEMS = "items",
    ENTITIES = "entities"
}
interface Data {
    category: Category,
    id: number,
    subId: number,
    x: number,
    y: number,
    name: string,
    nameId: string
}

type DataJson = Array<Data>

interface DataMap {
    [key: string]: Data
}

interface Sprite {
    path: string,
    category: Category,
    width: number,
    height: number,
    buffer?: Buffer,
    image?: Image,
    outDirPath?: string
}
class MinecraftIconsTools {

    reloadData(dataRawFilePaths: string[] = [], sprite: Array<Sprite> = []) {
        return new Promise<void>((resv) => {


            // const data = MinecraftIconsTools.parseRaw(dataRaw)
            const data = MinecraftIconsTools.joinRaws(dataRawFilePaths)

            const sortedData = MinecraftIconsTools.sortedByIdAndSubId(data)

            const mappedData = MinecraftIconsTools.toMap(sortedData)

            writeFileSync(resolve(ASSETS_DIR, "data.json"), JSON.stringify(sortedData), { encoding: "utf-8" })

            writeFileSync(resolve(ASSETS_DIR, "data.map.json"), JSON.stringify(mappedData), { encoding: "utf-8" })

            writeFileSync(resolve(ASSETS_DIR, "data.map.js"), MinecraftIconsTools.mapToJSFile(mappedData), { encoding: "utf-8" })

            MinecraftIconsTools.exportIcons(sortedData, sprite).then(() => {
                resv()
            })

        })
    }

    static joinRaws(dataRawFilePaths: string[]) {

        const allData: DataJson = []

        for (const path of dataRawFilePaths) {
            try {
                const dataRaw: DataJson = JSON.parse(readFileSync(path, { encoding: "utf-8" }))
                if (!Array.isArray(dataRaw)) throw new Error(`Raw file ${path} must be array`)
                allData.push(...dataRaw)
            } catch (e) {
                console.error(`Can not parse raw file ${path}`, e)
            }
        }
        return allData
    }

    static sortedByIdAndSubId(data: DataJson): DataJson {
        return data.sort((itemA, itemB) => {
            return (itemA.id * 10 + itemA.subId) - (itemB.id * 10 + itemB.subId)
        })
    }

    static toMap(data: DataJson): DataMap {
        const dataMap: DataMap = {}

        data.forEach(item => {
            const id = `${item.category}-${item.id}-${item.subId}`
            dataMap[id] = { ...item }
        })

        return dataMap
    }

    static mapToJSFile(dataMap: DataMap, exportVariableName = "DATA", constant = true): string {
        return `${constant ? "const" : "let"} ${exportVariableName} = ${JSON.stringify(dataMap)};`
    }

    static async exportIcons(dataJson: DataJson, sprites: Array<Sprite> = []) {
        return new Promise(async (resv) => {

            for (let sprite of sprites) {
                sprite.buffer = readFileSync(sprite.path)
                sprite.image = await Image.decode(sprite.buffer)
                if (!sprite.outDirPath) {
                    sprite.outDirPath = resolve(API_DIR, sprite.category)
                }
                if (!existsSync(sprite.outDirPath)) mkdirSync(sprite.outDirPath, { recursive: true })
            }

            dataJson.forEach(async (data) => {

                const sprite = sprites.find((s) => s.category === data.category)

                if (!sprite) return console.error(`Can not get sprite for category ${data.category}`)

                const fileName = getFilename(data.category, data.id, data.subId)

                let icon = sprite.image?.clone()!

                icon = icon.crop(data.x * -1, data.y * -1, sprite.width, sprite.height)

                const bufferIcon = await icon?.encode(1).catch(e => {
                    console.error(`Can not encode icon ${fileName}`, e)
                })

                if (!bufferIcon) return console.error(`Can not export icon ${fileName}`)

                writeFileSync(resolve(sprite.outDirPath!, fileName), bufferIcon)
            })


        })
    }
}


if (process.argv[2].indexOf("--reload-data") !== -1) {
    const minecraftIconsTools = new MinecraftIconsTools()
    minecraftIconsTools.reloadData(
        [
            resolve(ASSETS_DIR, "data_raw_items.json"),
            resolve(ASSETS_DIR, "data_raw_entities.json"),
        ],
        [
            {
                category: Category.ITEMS,
                path: resolve(ASSETS_DIR, "items-28.png"),
                height: 32,
                width: 32
            },
            {
                category: Category.ENTITIES,
                path: resolve(ASSETS_DIR, "entities-28.png"),
                height: 32,
                width: 32
            }
        ]
    )
}


import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { ASSETS_DIR } from "./global"

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

class MinecraftIconsTools {

    reloadData(dataRawFilePaths: string[] = []) {
        return new Promise<void>((resv) => {


            // const data = MinecraftIconsTools.parseRaw(dataRaw)
            const data = MinecraftIconsTools.joinRaws(dataRawFilePaths)

            const sortedData = MinecraftIconsTools.sortedByIdAndSubId(data)

            const mappedData = MinecraftIconsTools.toMap(sortedData)

            writeFileSync(resolve(ASSETS_DIR, "data.json"), JSON.stringify(sortedData), { encoding: "utf-8" })

            writeFileSync(resolve(ASSETS_DIR, "data.map.json"), JSON.stringify(mappedData), { encoding: "utf-8" })

            writeFileSync(resolve(ASSETS_DIR, "data.map.js"), MinecraftIconsTools.mapToJSFile(mappedData), { encoding: "utf-8" })

            resv()
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

    // static parseRaw(dataRaw: Buffer): DataJson {
    //     const dataSplited = dataRaw.toString("utf-8").split("\n")

    //     let dataJson: DataJson = []

    //     function pxToInt(pxString: string) {
    //         return Number(pxString.trim().replace("px", "").replace("-", ""))
    //     }

    //     dataSplited.forEach(line => {

    //         if (line == "") return

    //         const values = line.trim().split(" ")
    //         if (values.length != 3) throw new Error(`Error on line  ${line}`)

    //         const classKeySplitted = values[0].split("-")
    //         if (classKeySplitted.length !== 3 && classKeySplitted.length !== 4) throw new Error(`Erro on split classKey ${values[0]}`)

    //         dataJson.push({
    //             name: "",
    //             nameId: "",
    //             category: classKeySplitted[0].toLowerCase() as Category,
    //             id: Number(classKeySplitted[2]),
    //             subId: Number(classKeySplitted[3]) || 0,
    //             x: pxToInt(values[1]),
    //             y: pxToInt(values[2]),
    //         })
    //     })

    //     return dataJson as DataJson
    // }

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

    exportIcons() {

    }
}


if (process.argv[2].indexOf("--reload-data") !== -1) {
    const minecraftIconsTools = new MinecraftIconsTools()
    minecraftIconsTools.reloadData([
        resolve(ASSETS_DIR, "data_raw_items.json"),
        resolve(ASSETS_DIR, "data_raw_entities.json")
    ])
}


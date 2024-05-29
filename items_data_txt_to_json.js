const {writeFileSync, readFileSync} = require("fs")
const { resolve } = require("path")

// Extraido em https://minecraft-ids.grahamedgecombe.com/
// css: https://minecraft-ids.grahamedgecombe.com/stylesheets/bundles/all/1644090399.css
// <class> <x_offset> <y_offset>

const DATA_TXT = readFileSync(resolve(process.cwd(), "data.txt"), {encoding: "utf-8"}).split("\n")

function transform(data) {
    let dataJson = {}

    function pxToInt(pxString) {
        return Number(pxString.trim().replace("px", "").replace("-", ""))
    }

    data.forEach(line => {
        const values = line.trim().split(" ")
        if (values.length != 3) throw new Error(`Error on line  ${line}`);
        dataJson[values[0]] = {
            x: pxToInt(values[1]),
            y: pxToInt(values[2])
        }
    })

    return dataJson
}

writeFileSync(resolve(process.cwd(), "assets/data.json.js"), Buffer.from("const DATA = " + JSON.stringify(transform(DATA_TXT))) , {encoding:"utf-8"} )
console.log("OK")
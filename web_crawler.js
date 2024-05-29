const CATEOGRY = "items" //https://minecraft-ids.grahamedgecombe.com/
// const CATEOGRY = "entities" //https://minecraft-ids.grahamedgecombe.com/entities

function downloadObj(obj, filename) {
    const url = URL.createObjectURL( new Blob([JSON.stringify(obj)], {
        type: 'text/plain'
    }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename // Nome do arquivo a ser baixado
    link.click()
}

let rows = document.getElementById("rows")

let data_raw = []

rows.querySelectorAll("tbody tr").forEach(row => {

    /* Id and SubId */
    let id = row.querySelector("td.id").innerText.split(":")
    const subId = (id[1]!==undefined) ? Number(id[1]) : 0
    id = Number(id[0])

    /* Sprite offset */
    const img = row.querySelector("td.row-icon").querySelector(".icon")
    const [x,y] = getComputedStyle(img).backgroundPosition.split(" ").map(offset => Number(offset.replace("px", "")))

    /* Name and NameId */
    const name = row.querySelector("td.row-desc").querySelector(".name").innerText
    const nameId = row.querySelector("td.row-desc").querySelector(".text-id").innerText.replace(/[\(\)]/g, "")

    data_raw.push({
        category: CATEOGRY,
        id,
        subId,
        x,
        y,
        name,
        nameId
    })
    
})

downloadObj(data_raw, `data_raw_${CATEOGRY}.json`) 
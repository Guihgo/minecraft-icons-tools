import express from "express"
import { resolve } from "node:path"
import { PUBLIC_DIR } from "./global"

const app = express()

app.use("/assets", express.static(resolve(PUBLIC_DIR, "assets")))
app.use("/api", express.static(resolve(PUBLIC_DIR, "api")))

app.get("/", (req, res) => {
    res.sendFile(resolve(PUBLIC_DIR, "./index.html"))
})

app.listen(3000, () => {
    console.log("Listening on http:localhost:3000/")
})
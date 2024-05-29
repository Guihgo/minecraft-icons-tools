const express = require("express")
const { resolve } = require("path")

const app = express()

app.use("/assets",express.static("assets"))
app.use("/api",express.static("api"))

app.get("/", (req, res)=>{
    res.sendFile(resolve(process.cwd(), "index.html"))
})

app.listen(3000, ()=>{
    console.log("Listening on http:localhost:3000/")
})
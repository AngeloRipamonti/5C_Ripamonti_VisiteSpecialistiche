const express = require("express");
const bodyParser = require('body-parser');
let http = require("http");
const path = require('path');
const fs = require('fs');
const databaseClient = require("./database.js");
const config = JSON.parse(fs.readFileSync('configuration.json'));
config.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const app = express();
const booking = databaseClient(config, (JSON.parse(fs.readFileSync("config.json"))).tipologie);
/*booking.insert({
    data: "2025/02/18",
    ora: 9,
    cliente:"Luca Avveduto",
    type: "Cardiologia"
})*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public/src")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

app.post("/add", async (req, res) => {
    const data = req.body;
    await booking.insert(data);
    res.json({ result: "Ok" });   
});

app.get("/get", async (req, res) => {
    const dict = await booking.selectAll();
    res.json({ result: dict });
});

app.post("/filter", async (req, res) => {
    const data = req.body.value;
    const dict = await booking.select(data);
    if(dict) res.json({ result: dict });
    else res.json({ error: "Not found"});
});


app.get("/config", async (req, res) => {
    const config = JSON.parse(fs.readFileSync('config.json'));
    res.json(config);
});


const server = http.createServer(app);

server.listen(5600, () => {
    console.log("- server running");
});
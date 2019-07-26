const express = require("express");
const cors  = require("cors");

const { server_port } = require("../keys");
const search = require("./search");

const app = express();
app.use(cors())
app.use(express.json());

app.get("/", search);

app.listen(server_port, () => console.log(`Listening on port ${server_port}`))
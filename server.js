const express = require("express");

const Auth = require("./routes/users");

const server = express();
server.use(express.json());



server.use("/api/auth", Auth);

module.exports = server;

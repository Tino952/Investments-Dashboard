// Setting up simple express server

const express = require("express");

const app = express();

const port = process.env.PORT || 4004;

app.use(express.static('dist'));

// Initializing Server

app.listen(port, () => console.log(`running on localhost ${port}`));

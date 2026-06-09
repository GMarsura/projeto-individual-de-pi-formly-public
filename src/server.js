const app = require('./app');
const express = require('express')
const cors = require('cors')
require('dotenv').config();

const PORT = process.env.PORT || 3000;
app.use(cors)
app.use(express.json())
app.listen(PORT, () => console.log("funcionando na porta " + PORT + `\n http://localhost:${PORT}`));
const path = require('path');
const express = require('express');
const cors = require('cors');
const formRoutes = require('../src/routes/formRoutes');
const authRoutes = require('../src/routes/authRoutes');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.use("auths",authRoutes);
app.use("forms",formRoutes);

app.use(authRoutes);
app.use(formRoutes);

module.exports = app;





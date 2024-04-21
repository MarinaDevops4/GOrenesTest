const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(morgan('dev')); // Middleware de desarrollo para registros en consola
app.use(express.json()); // Para que el servidor pueda leer datos JSON
app.use(express.urlencoded({ extended: true }));

// Usa las rutas de usuario
app.use("/api/users", userRoutes);

module.exports = app;

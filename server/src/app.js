const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Establece el puerto del servidor
app.set('port', process.env.PORT || 3000);

// Middleware para permitir solicitudes de otros dominios
app.use(cors());

// Middleware para registrar solicitudes HTTP en la consola durante el desarrollo
app.use(morgan('dev'));

// Middleware para analizar solicitudes con cuerpo JSON
app.use(express.json());

// Middleware para analizar solicitudes con datos codificados en la URL
app.use(express.urlencoded({ extended: true }));

// Usa las rutas definidas para los usuarios
app.use("/api/users", userRoutes);

module.exports = app;

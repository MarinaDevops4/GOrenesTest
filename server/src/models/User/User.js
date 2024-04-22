const mongoose = require('mongoose');

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // El nombre de usuario debe ser único
  },
  email: {
    type: String,
    required: true,
    unique: true // El correo electrónico debe ser único
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // La fecha de creación se establece automáticamente al momento de la creación del usuario
  }
});

// Definición del modelo de usuario basado en el esquema
const User = mongoose.model('User', userSchema);

module.exports = User;

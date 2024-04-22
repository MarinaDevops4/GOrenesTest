const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Conecta a la base de datos MongoDB utilizando la URL proporcionada en el archivo .env.
 * @returns {Promise<void>} Una promesa que se resuelve una vez que la conexión se ha establecido correctamente.
 * @throws {Error} Si la conexión a la base de datos falla.
 */
const connectDB = async () => {
  try {
    // Conectar a la base de datos utilizando la URL especificada en el archivo .env
    await mongoose.connect(`mongodb://127.0.0.1/${process.env.DATABASE_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    // Si hay un error al conectar, imprimir el mensaje de error y salir del proceso
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

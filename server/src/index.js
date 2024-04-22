require('dotenv').config();
const connectDB = require('./database.js');
const app = require('./app');

// Conectar a la base de datos
connectDB();

// Obtener el puerto del archivo .env o usar el puerto predeterminado (3000)
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Manejar errores de servidor
server.on('error', (error) => {
  console.error('Server error:', error.message);
});

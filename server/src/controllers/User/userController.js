
const User = require('../../models/User/User.js');


const userCtrl = {};
// Controlador para el registro de usuarios
userCtrl.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario utilizando el modelo
    const newUser = new User({ username, email, password });
    await newUser.save();

    return res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};
userCtrl.userLogin = async (req, res) => {

};

userCtrl.getUser = async (req, res) => {
  try {
    console.log('get user');
    res.status(200).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    // Manejo de errores si ocurre algún problema durante el registro
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

module.exports = userCtrl;


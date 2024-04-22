const User = require('../../models/User/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userCtrl = {};

/**
 * Controlador para el registro de usuarios.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} Objeto JSON con el mensaje de éxito y el token de autenticación.
 */
userCtrl.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña antes de guardarla en la base de datos
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario con la contraseña hasheada
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    // Crear y firmar el JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Respuesta con el mensaje de éxito, la información del usuario y el token
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    // Manejar errores
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

/**
 * Controlador para el inicio de sesión de usuarios.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} Objeto JSON con el mensaje de éxito, el token de autenticación y la información del usuario.
 */
userCtrl.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Buscar el usuario por su correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'El correo electrónico proporcionado no está registrado' });
    }

    // Verificar si la contraseña coincide
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña ingresada no es correcta' });
    }

    // Crear y firmar el token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Enviar el token y la información del usuario al cliente
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (error) {
    // Manejar errores
    return res.status(500).json({ message: 'Error al iniciar sesión del usuario', error: error.message });
  }
};

/**
 * Controlador para obtener todos los usuarios.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} Objeto JSON con la lista de usuarios.
 */
userCtrl.getUsers = async (req, res) => {
  try {
    // Buscar todos los usuarios en la base de datos
    const users = await User.find();

    // Enviar la lista de usuarios como respuesta
    res.status(200).json({ users });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

/**
 * Controlador para obtener un usuario por su ID de token.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Object} Objeto JSON con la información del usuario.
 */
userCtrl.getUserByToken = async (req, res) => {
  try {
    // Verificar si se proporcionó un token de autorización
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Token de autorización no proporcionado' });
    }

    // Extraer el token del encabezado 'Authorization'
    const token = req.headers.authorization.split(' ')[1];

    // Verificar y decodificar el token para obtener el ID de usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Buscar al usuario por su ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Enviar la información del usuario como respuesta
    res.status(200).json(user);
  } catch (error) {
    // Manejar errores al verificar o decodificar el token
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    res.status(500).json({ message: 'Error al buscar al usuario', error: error.message });
  }
};

module.exports = userCtrl;

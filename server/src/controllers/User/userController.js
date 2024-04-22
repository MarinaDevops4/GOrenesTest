
const User = require('../../models/User/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userCtrl = {};
// Controlador para el registro de usuarios
userCtrl.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
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

    console.log(newUser);
    await newUser.save();

    

    // Crear el JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

   // Respuesta incluyendo el token
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
    return res.status(500).json({ message: 'Error al registrar usuario', error: error });
  }
};




userCtrl.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Buscar el usuario por su correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      // El correo electrónico no existe en la base de datos
      return res.status(404).json({ message: 'El correo electrónico proporcionado no está registrado' });
    }

    // Verificar si la contraseña coincide
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // La contraseña proporcionada no es correcta
      return res.status(400).json({ message: 'La contraseña ingresada no es correcta' });
    }

    // Crear el token JWT
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
    // Manejar errores generales
    return res.status(500).json({ message: 'Error al iniciar sesión del usuario', error: error.message });
  }
};



userCtrl.getUsers = async (req, res) => {
  try {
    
    const users = await User.find();

    // Envía la respuesta con los usuarios encontrados
    res.status(200).json({ users });
  } catch (error) {
    // Manejo de errores si ocurre algún problema al obtener los usuarios
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};
userCtrl.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id); // Busca al usuario por ID en la base de datos
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // Retorna 404 si no se encuentra el usuario
    }
    res.status(200).json(user); // Retorna el usuario encontrado
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar al usuario', error: error.message }); // Manejo de errores en caso de fallo en la operación
  }
};



userCtrl.getUserByToken = async (req, res) => {
    try {
        // Verifica si existe el encabezado de autorización
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Token de autorización no proporcionado' });
        }

        // Extrae el token del encabezado 'Authorization'
        const token = req.headers.authorization.split(' ')[1];

        // Verifica y decodifica el token para obtener el ID de usuario
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log(userId);

        // Busca al usuario por su ID
        const user = await User.findById(userId);
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        // Manejo de errores al verificar o decodificar el token
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido' });
        }
        res.status(500).json({ message: 'Error al buscar al usuario', error: error.message });
    }
};

  


module.exports = userCtrl;


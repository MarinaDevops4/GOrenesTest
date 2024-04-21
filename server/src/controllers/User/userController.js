
const User = require('../../models/User/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    // Hashear la contraseña antes de guardarla en la base de datos
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario con la contraseña hasheada
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Crear el JWT
    const token = jwt.sign({ data: 'data' }, process.env.JWT_SECRET);

    // Respuesta incluyendo el token
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email, 

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
    const user= await User.findOne({ email });
    if (!user){
      return res.status(404).json({message:'Usuario no encontrado'});
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' }); // Si la contraseña no coincide, devuelve un error 400
    }


    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,    // Usa una clave secreta almacenada en las variables de entorno
      { expiresIn: '1h' }        // Establece la caducidad del token
    );

    // Enviar el token al cliente
    res.json({ 
      message: 'Login exitoso',
      token, 
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error to login the user', error: error.message });
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

module.exports = userCtrl;


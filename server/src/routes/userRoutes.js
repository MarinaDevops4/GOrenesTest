const { Router } = require('express');
const router = Router();
const userCtrl = require('../controllers/User/userController');

/**
 * Rutas relacionadas con los usuarios.
 * Todas las rutas comienzan con '/api/users'.
 */

// Obtiene todos los usuarios
router.get('/', userCtrl.getUsers);

// Obtiene un usuario por su token
router.get('/:token', userCtrl.getUserByToken);

// Registra un nuevo usuario
router.post('/register', userCtrl.registerUser);

// Inicia sesión de usuario
router.post('/login', userCtrl.userLogin);

module.exports = router;

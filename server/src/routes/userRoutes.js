const { Router } = require('express');
const router = Router();
const userCtrl = require('../controllers/User/userController');

router.get('/', userCtrl.getUsers);
router.get('/:token', userCtrl.getUserByToken);
router.post('/register', userCtrl.registerUser );
router.post('/login', userCtrl.userLogin);


module.exports = router;
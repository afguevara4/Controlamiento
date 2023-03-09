const express = require('express');
const LoginController = require('../controllers/LoginControllers');


const router = express.Router();

router.get('/login', LoginController.login);
router.post('/login', LoginController.auth);
router.get('/register', LoginController.register);
router.get('/register2', LoginController.register2);
router.post('/register', LoginController.storeUser);
router.get('/logout', LoginController.logout);


module.exports = router;
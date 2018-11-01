const express = require('express');
const v1Authes = express.Router();
const RegisterController = require('./controllers/registerController');
const LoginController = require('./controllers/loginController');
v1Authes.post('/register', RegisterController.register);
v1Authes.get('/verify/:token', RegisterController.verifyAccount);
v1Authes.post('/login', LoginController.login);
v1Authes.get('/forgot-password/:identifier', LoginController.sendRecoveryPassword);
v1Authes.post('/change-password', LoginController.changePassword);


module.exports = v1Authes;

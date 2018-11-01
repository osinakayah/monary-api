require('../repositories/passportRepository');
const LoginRepository = require('../repositories/loginRepository');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LoginController = function () {
    return {
        changePassword: async function (request, response) {
            const identifier = request.body.identifier;
            const newPassword = request.body.password;

            try {
                const changePasswordResponse = await LoginRepository.changePassword(identifier, newPassword);
                response.json(changePasswordResponse);
            }
            catch (error) {
                response.json(error);
            }
        },
        sendRecoveryPassword: async function (request, response) {
            const identifier = request.params.identifier;
            try {
                const forgotPasswordResponse = await LoginRepository.sendRecoveryPassword(identifier);
                return response.json(forgotPasswordResponse);
            }
            catch (error){
                return response.json(error);
            }

        },
        login: function (request, response) {
            passport.authenticate("local", {session: false}, (err, user, info) => {
                console.log(err, user, info);
                if (err || !user) {
                    return response.status(401).json({
                        status: false,
                        message: info.message,
                        data   : user
                    });
                }
                req.login(user, {session: false}, (err) => {
                    if (err) {
                        return response.status(401).json({
                            status: false,
                            message: info.message,
                            data   : err
                        });
                    }
                    jwt.sign({_id: user._id, email: user.email, balance: user.balance}, process.env.SESSION_SECRET, {expiresIn: (60 * 60 * 60)}, (err, token) => {
                        return response.json({status: true, message: 'Login Successful', data: {token} });
                    });

                });
            })(request, response);
        }
    }
}();
module.exports = LoginController;

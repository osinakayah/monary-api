const RegisterRepository = require('../repositories/registerRepository');
const RegisterController = function () {
    return {
        verifyAccount: async function (request, response) {
            const token = request.params.token;
            try {
                const verificationResponse = await RegisterRepository.verify(token);
                response.json(verificationResponse);
            }
            catch (error) {
                response.json(error);
            }

        },
        register: async function (request, response) {
            const uniqueIdentifier = request.body.uniqueIdentifier;
            const password = request.body.password;
            const nickname = request.body.nickname;

            try {
                const registerationResponse = await RegisterRepository.register(nickname, uniqueIdentifier, password);
                console.log(registerationResponse);
                response.json(registerationResponse);
            }
            catch (error) {
                response.json(error);
            }

        }
    }
}();

module.exports = RegisterController;

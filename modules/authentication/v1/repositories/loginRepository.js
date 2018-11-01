const EmailRepository = require('../../../email/repository/EmailRepository');
const UserToken = require('../models/UserTokenModel');
const User = require('../models/UserModel');
const RegisterRepository = require('../repositories/registerRepository');
const LoginRepository = function () {
    return {
        changePassword: function (identifier, newPassword) {
          return new Promise(function (resolve, reject) {
              User.findOne({uniqueIndentifier: identifier}, (error, iuser) => {
                  if (error) {
                      reject({status: false, message: 'An error occurred, please try again', data:error});
                  }
                  else if (iuser) {
                      iuser.password = newPassword;
                      iuser.save((error1) => {
                          if (!error1) {
                              resolve({status: true, message: 'Password changed successfully'});
                          }
                          else {
                              reject({status: false, message: 'An error occurred, please try again', data:error1});
                          }
                      });
                  }
              });
          });
        },
        sendRecoveryPassword: function (uniqueIndentifier) {
            return new Promise(function (resolve, reject) {
                User.findOne({uniqueIndentifier: uniqueIndentifier}, (error, user) => {
                    if (error) {
                        reject({status: false, message: 'An error occurred, please try again', data:error});
                    }
                    else if (user) {
                        const userToken = new UserToken();
                        userToken.token = RegisterRepository.generateVerificationCode();
                        userToken._userId = user._id;
                        userToken.save(function (error1) {
                            if (!error1) {
                                if (RegisterRepository.validateEmail(uniqueIndentifier)) {
                                    EmailRepository.sendEmail(uniqueIndentifier, 'Forgot Password', userToken.token);
                                }
                                else {
                                    EmailRepository.sendSms(uniqueIndentifier, userToken.token);
                                }
                                resolve({status: true, message: 'Reset code sent successfully'});
                            }
                            else {
                                reject({status: false, message: 'An error occurred', data: error1});
                            }
                        });
                    }
                    else {
                        reject({status: false, message: 'Account not found'});
                    }
                });

            });

        }
    }
}();

module.exports = LoginRepository;

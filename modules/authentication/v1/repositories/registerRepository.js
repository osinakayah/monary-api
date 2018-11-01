const User = require('../models/UserModel');
const UserToken = require('../models/UserTokenModel');
const EmailRepository = require('../../../email/repository/EmailRepository');
const RegisterRepository = function () {
    const validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    const reverseString = (str) => {
        return str.split("").reverse().join("").substr(0, 6);
    }
    const generateVerificationCode = function () {
      const dateTimeString = new Date().getTime().toString();
      return reverseString(dateTimeString);
    };
    return {
        validateEmail,
        generateVerificationCode,
        verify: function (token) {
          return new Promise(function (resolve, reject) {
              UserToken.findOne({token}, function (err, userTokenModel) {
                  if (err) {
                      reject({status: false, message: "Something went wrong", data:err});
                  }
                  else if (userTokenModel) {
                      User.findOne({_id: userTokenModel._userId}, function (err1, user) {
                          if (err1) {
                              reject({status: false, message: "Something went wrong", data:err1});
                          }
                          else if (user) {
                              user.accountVerified = true;
                              user.save(function (err3) {
                                  if (!err3) {
                                      resolve({status: true, message: "Account Verified Successfully", data:{}});
                                  }
                                  else {
                                      reject({status: false, message: "Please try again", data:err3});
                                  }
                              });
                          }
                      });
                  }
                  else {
                      reject({status: false, message: "Token has expired, please try again", data:{}});
                  }
              });
          });
        },
        register: function (nickname, uniqueIdentifier, password) {
            return new Promise(function (resolve, reject) {
                User.findOne({uniqueIndentifier: uniqueIdentifier}, (err, existingUser) => {
                    if (existingUser) {
                        reject({status: false, message: "Account taken", data:{}});
                    }
                    else if (err) {
                        reject({status: false, message: "Something went wrong", data:err});
                    }
                    else {
                        const newUser = new User();
                        newUser.uniqueIndentifier = uniqueIdentifier;
                        newUser.password = password;
                        newUser.nickname = nickname;
                        newUser.save(function (error) {
                            if (error) {
                                reject({status: false, message: "Something went wrong", data:error});
                            }
                            else {
                                const userToken = new UserToken();
                                userToken.token = generateVerificationCode();
                                userToken._userId = newUser._id;
                                userToken.save(function (error1) {
                                    if (!error1) {
                                        if (validateEmail(uniqueIdentifier)) {
                                            EmailRepository.sendEmail(uniqueIdentifier, 'Verfify Account', userToken.token);
                                        }
                                        else {
                                            EmailRepository.sendSms(uniqueIdentifier, userToken.token);
                                        }
                                        resolve({status: true, message: "Account Created Successfully", data:{token: userToken.token}});
                                    }
                                    else {
                                        reject({status: false, message: "Please try again", data:error1});
                                    }
                                });

                            }
                        });
                    }
                })
            })
        }
    }
}();
module.exports = RegisterRepository;

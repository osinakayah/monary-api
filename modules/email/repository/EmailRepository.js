'use strict';
const nodemailer = require('nodemailer');
const request = require('request');

const EmailRepository = function () {
    
    return {
        sendSms: function (phone, message) {
            request.post('https://textbelt.com/text', {
                form: {
                    phone,
                    message,
                    key: 'e4b9974d57c7997a670897c49a76a05a55f0d9d7keacRMJ7xfwS3bY6bPCzDv5Cs',
                },
            }, function(err, httpResponse, body) {
                if (err) {
                    console.error('Error:', err);
                    return;
                }
                console.log(err, body);
            })
        },
        sendEmail: function (to, subject, text) {
            return new Promise(function (resolve, reject) {
                const transporter = nodemailer.createTransport({
                    service: "SendGrid",
                    auth: {
                        user: process.env.SENDGRID_USER,
                        pass: process.env.SENDGRID_PASSWORD
                    }
                });

                let mailOptions = {
                    from: 'noreply@monary.com', // sender address
                    to, // list of receivers
                    subject, // Subject line
                    text
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    console.log(error, info);
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(info);
                    }
                });
            });
        }
    }
}();
module.exports = EmailRepository;

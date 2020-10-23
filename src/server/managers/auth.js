const Promise = require('bluebird');
var bcrypt = require('bcryptjs');
var passport = require('passport');
const jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer');
var crypto = require('crypto');

Auth = (function () {

  var global_wagner;

  function Auth(wagner) {
    global_wagner = wagner;
  }

  Auth.prototype["resetPassword"] = function (req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        let token = crypto.randomBytes(20).toString('hex');
        var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: false,
          requireTLS: true,
          service: 'gmail',
          // auth: {
          //   user: 'somil.verma@agicent.com',
          //   pass: 'somilverma49'
          // }
          auth: {
            user: 'somilverma1996@gmail.com',
            pass: '8979822775'
          }
        });
        const mailOptions = {
          from: 'somil.verma@agicent.com',
          to: req.body.email_id,
          subject: 'Password Reset Request',
          html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }

        var Persons = global_wagner.get("Persons");
        let user = await Persons.find({ email_id: req.body.email_id })
        if (user) {
          await Persons.updateOne(
            { email_id: req.body.email_id },
            {
              $set: {
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 3600000
              }
            }
          )
          let sendmail = await transporter.sendMail(mailOptions)
          if (sendmail) {
            resolve({ message: "Reset Password link has been sent to your registered email address. " })
          }
        }
      } catch (err) {
        console.log(err)
        reject(err)
      }
    });
  }

  Auth.prototype["login"] = function (req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        passport.authenticate('userLogin', function (err, user, info) {
          if (err) {
            reject(err)
          };
          if (user) {
            var token = jwt.sign({ _id: user._id }, 'privatekey');
            var userDict = {
              _id: user._id,
              full_name: user.full_name,
              email_id: user.email_id,
              city: user.city
            }

            resolve({ token: token, user: userDict });
          } else {
            reject(info);
          };
        })(req, res);

      } catch (err) {
        reject(err)
      }
    });
  }

  Auth.prototype["signUp"] = function (req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        passport.authenticate('userSignup', function (err, user, info) {
          if (err) {
            reject(err)
          };
          if (user) {
            var token = jwt.sign({ _id: user._id }, 'privatekey');
            resolve({ token: token, user: user });
          } else {
            reject(info);
          };
        })(req, res);

      } catch (err) {
        reject(err)
      }
    });
  }

  Auth.prototype["logout"] = function (req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        passport.authenticate('userLogout', function (err, msg, info) {
          if (err) {
            reject(err)
          };
          resolve({ message: msg })
        })(req, res);

      } catch (err) {
        reject(err)
      }
    });
  }

  return Auth;

})();

module.exports = Auth;

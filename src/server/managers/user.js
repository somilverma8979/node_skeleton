const Promise = require('bluebird');
var bcrypt = require('bcryptjs');
var passport = require('passport');
const jwt = require('jsonwebtoken')


User = (function () {

  var global_wagner;

  function User(wagner) {
    global_wagner = wagner;
  }
  console.log(global_wagner)
  User.prototype["addUser"] = function (req) {
    return new Promise(function (resolve, reject) {
      var Persons = global_wagner.get("Persons");
      let payload = {
        full_name: req.body.full_name,
        email_id: req.body.email_id,
        username: req.body.username,
        city: req.body.city
      }
      bcrypt.genSalt(10, async function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          payload.password = hash
        });
        try {
          let personData = await Persons.findOne({ email_id: req.body.email_id })
          console.log(personData)
          if (personData != null || personData != undefined) {
            reject({ message: "Email address is already taken. Please try another." })
          } else {
            let newPerson = await Persons.create(payload)
            if (newPerson != null) {
              resolve({ message: "User added successfully." })
            }
          }
        } catch (err) {
          reject(err)
        }
      });
    });
  };

  User.prototype["getAllUsers"] = function (req) {
    return new Promise(async function (resolve, reject) {
      var Persons = global_wagner.get("Persons");
      try {
        let personData = await Persons.find({}, { password: false })
        if (personData) {
          resolve(personData)
        }
      } catch (err) {
        reject(err)
      }
    });
  };

  User.prototype["updateUser"] = function (req) {
    return new Promise(async function (resolve, reject) {
      var Persons = global_wagner.get('Persons')
      try {
        let personData = await Persons.findOne({ _id: req.body.userId })
        console.log(personData)
        if (personData != null || personData != undefined) {
          let updatedData = await Persons.updateOne(
            { _id: req.body.userId },
            {
              $set: {
                full_name: req.body.full_name,
                email_id: req.body.email_id,
                city: req.body.city
              }
            }
          )
          if (updatedData) {
            resolve({ message: "User updated successfully." })
          }
          console.log(updatePerson)
        } else {
          reject({ message: "User does not exist." })
        }
      } catch (err) {
        reject(err)
      }
    });
  };

  User.prototype["deleteUser"] = function (req) {
    return new Promise(async function (resolve, reject) {
      if (!req.body.userId) {
        reject({ message: "Please enter user id." })
      }
      var Persons = global_wagner.get('Persons')
      try {
        let personData = await Persons.findOne({ _id: req.body.userId })
        console.log(personData)
        if (personData != null || personData != undefined) {
          let deleteData = await Persons.deleteOne(
            { _id: req.body.userId },
          )
          if (deleteData) {
            resolve({ message: "User deleted successfully." })
          }
        } else {
          reject({ message: "User does not exist." })
        }
      } catch (err) {
        reject(err)
      }
    });
  };

  User.prototype["login"] = function (req, res) {
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

  User.prototype["signUp"] = function (req, res) {
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

  User.prototype["editProfile"] = function (req) {
    return new Promise(async function (resolve, reject) {
      try {
        let userData = req.decoded
        let Persons = global_wagner.get("Persons")
        let user = await Persons.findOne({ _id: userData._id })
        if (user) {
          if (!req.file) {
            reject({ message: 'Please select profile pic' });
          }else {
            console.log(req.file)
            user.profile_pic = req.file.originalname
            await user.save()
            resolve(user)
          }
        } else {
          reject({ message: "User not found" })
        }
      } catch (err) {
        reject(err)
      }
    });
  };

  return User;

})();

module.exports = User;

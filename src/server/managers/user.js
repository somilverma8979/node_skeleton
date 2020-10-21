const Promise = require('bluebird');
var bcrypt = require('bcryptjs');

User = (function () {

  var global_wagner;

  function User(wagner) {
    global_wagner = wagner;
  }

  User.prototype["addUser"] = function (req) {
    return new Promise(function (resolve, reject) {
      if (!req.body.full_name || !req.body.email_id || !req.body.password || !req.body.city) {
        reject({ message: "All fields (name, email, city, password) are required. " })
      }
      var Persons = global_wagner.get("Persons");
      let payload = {
        full_name: req.body.full_name,
        email_id: req.body.email_id,
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
      if (!req.body.full_name || !req.body.email_id || !req.body.userId) {
        reject({ message: "All fields (name, email, userId) are required. " })
      }
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
          if(updatedData) {
            resolve({message: "User updated successfully."})
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
          if(deleteData) {
            resolve({message: "User deleted successfully."})
          }
        } else {
          reject({ message: "User does not exist." })
        }
      } catch (err) {
        reject(err)
      }
    });
  };

  return User;

})();

module.exports = User;

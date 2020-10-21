const Promise = require('bluebird');
const config = require('config');
const _ = require('underscore');
var bcrypt = require('bcryptjs');
const Person = require('../models/user/user.model');
var

  User = (function () {

    var global_wagner;

    function User(wagner) {
      global_wagner = wagner;
    }

    User.prototype["index"] = function (req) {
      console.log("check")
      return new Promise(function (resolve, reject) {

        var shop = global_wagner.get('shop');
        shop.findAll({ attributes: ['shop_name', 'shop_url'] }).then(result => {
          resolve(result);
        }).catch(error => {
          reject(error);
        });
      });
    };

    User.prototype["addUser"] = function (req) {
      return new Promise(function (resolve, reject) {
        if (!req.body.full_name) {
          reject({ message: "Please enter name." })
        }
        if (!req.body.email_id) {
          reject({ message: "Please enter email address. " })
        }
        if (!req.body.password) {
          reject({ message: "Please enter password" })
        }
        if (!req.body.city) {
          reject({ message: "Please enter city" })
        }
        global_wagner.invoke(function (Persons) {
          let payload = {
            full_name: req.body.full_name,
            email_id: req.body.email_id,
            city: req.body.city
          }
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
              payload.password = hash
            });
            Persons.findOne({ email_id: req.body.email_id }, function (err, data) {
              if (err)
                reject(err)
              if (data != null || data != undefined) {
                reject({ message: "Email address is already taken. Please try another." })
              } else {
                Persons.create(payload, function (err, data) {
                  if (err) reject(err)
                  resolve({ message: "User added successfully." })
                })
              }
            })
          });
        })
      });
    };

    User.prototype["getAllUsers"] = function (req) {
      return new Promise(function (resolve, reject) {
        global_wagner.invoke(function (Persons) {// done
          Persons.find({}, { password: false }, function (err, data) {
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        })
      });
    };

    User.prototype["updateUser"] = function (req) {
      return new Promise(function (resolve, reject) {
        if (!req.body.userId) {
          reject({ message: "Please enter user id." })
        }
        if (!req.body.full_name) {
          reject({ message: "Please enter name." })
        }
        if (!req.body.email_id) {
          reject({ message: "Please enter email address. " })
        }
        if (!req.body.city) {
          reject({ message: "Please enter city" })
        }
        global_wagner.invoke(function (Persons) {// done
          Persons.updateOne(
            {_id: req.body.userId},
            {
              $set: {
                full_name: req.body.full_name,
                email_id: req.body.email_id,
                city: req.body.city
              }
            }
          ).then(data => {
            resolve({message: "User updated successfully."})
          }).catch(err => {
            if(err.kind == "ObjectId") {
              reject({message: "User does not exist."})
            }else {
              reject(err)
            }
          })
        })
      });
    };

    User.prototype["deleteUser"] = function (req) {
      return new Promise(function (resolve, reject) {
        if (!req.body.userId) {
          reject({ message: "Please enter user id." })
        }
        
        global_wagner.invoke(function (Persons) {// done
          Persons.findOne({ _id: req.body.userId }, function(err, data) {
            if(data != null || data != undefined) {
              Persons.deleteOne(
                {_id: req.body.userId},
              ).then(data => {
                resolve({message: "User deleted successfully.",})
              }).catch(err => {
                reject(err)
              })
            }else {
              reject({message: "User does not exist."})
            }
          })
        })
      });
    };

    return User;

  })();

module.exports = User;

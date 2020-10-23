const Promise = require('bluebird');
var bcrypt = require('bcryptjs');
var passport = require('passport');
const jwt = require('jsonwebtoken')
var LocalStrategy = require('passport-local').Strategy;
var logout = require('express-passport-logout');

PassPort = (function () {

    var global_wagner;

    function PassPort(wagner) {
        global_wagner = wagner;
    }

    passport.use('userLogin', new LocalStrategy(function (username, password, done) {
        console.log(username, password, done)
        return new Promise(async function (resolve, reject) {
            try {
                var Persons = global_wagner.get("Persons");
                let user = await Persons.findOne({ username: username })
                if (!user) {
                    return done(null, false, { message: 'You have entered invalid credentials.' });
                } else {
                    bcrypt.compare(password, user.password, function (err, res2) {
                        if (res2 == false) {
                            return done(null, false, { message: 'You have entered invalid credentials.' });
                        }
                        else {
                            return done(null, user);
                        }
                    });
                };
            } catch (err) {
                reject(err)
            }
        })
    }));

    passport.use('userSignup', new LocalStrategy(async function (username, password, done) {
        try {
            var Persons = global_wagner.get("Persons");
            let user = await Persons.findOne({ username: username })
            // if (user != null || user != undefined) {
            //     // return done(null, false, { message: 'Username is taken. Please try another one.' });
            // } else
            if(!user) {
                bcrypt.genSalt(10, async function (err, salt) {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        let payload = {
                            username: username,
                            password: hash
                        }
                        console.log(payload)
                        let newPerson = await Persons.create(payload)
                        console.log(newPerson)
                        if (newPerson != null) {
                            console.log(newPerson)
                            return done(null, newPerson);
                        }
                    });
                })
            }
        } catch (err) {
            return done(null, false, err);
        }
    }));

    passport.use('userLogout', new LocalStrategy(function (username, password, done) {
        try {
            logout()
        } catch (err) {
            return done(null, false, err);
        }
    }));



    return PassPort;

})();

module.exports = PassPort;

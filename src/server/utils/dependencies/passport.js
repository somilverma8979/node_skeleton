const Promise = require('bluebird');
var bcrypt = require('bcryptjs');
var passport = require('passport');
const jwt = require('jsonwebtoken')
var LocalStrategy = require('passport-local').Strategy;
var logout = require('express-passport-logout');
var FacebookStrategy = require('passport-facebook')

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
                    var token = jwt.sign({ _id: user._id }, 'privatekey');
                    user.authToken = token
                    await user.save()
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
            if (!user) {
                bcrypt.genSalt(10, async function (err, salt) {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        // var token = jwt.sign({ _id: user._id }, 'privatekey');
                        let payload = {
                            username: username,
                            password: hash,
                            // authToken: token
                        }
                        let newPerson = await Persons.create(payload)
                        console.log(newPerson)
                        if (newPerson != null) {
                            var token = jwt.sign({ _id: newPerson._id }, 'privatekey');
                            newPerson.authToken = token
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

    passport.use(new FacebookStrategy({
        clientID: "453802488924395",
        clientSecret: "81509e5cb680c7e41debf89c6d144b02",
        callbackURL: "http://localhost:4000/auth/facebook/callback",
        profileFields: ['id', 'email', 'first_name', 'last_name'],
    },
        async function (accessToken, refreshToken, profile, cb) {
            console.log(profile)
            // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            //   return cb(err, user);
            // });
            // const users = User.getUsers();
            // var Persons = global_wagner.get("Persons");
            // const matchingUser = Persons.find({facebookId: profile.id});

            // if (matchingUser) {
            //     done(null, matchingUser);
            //     return;
            // }

            // const payload = {
            //     facebookId: profile.id,
            //     full_name: profile.name.givenName + " " + profile.name.familyName,
            //     email: profile.emails && profile.emails[0] && profile.emails[0].value,
            // };
            // let newUser = await Persons.create(payload)
            
            // done(null, newUser);
        }
    ));



    return PassPort;

})();

module.exports = PassPort;

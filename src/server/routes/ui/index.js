const { check, validationResult } = require('express-validator');
const HTTPStatus = require('http-status');
var bcrypt = require("bcryptjs")
module.exports = function (app, wagner) {

    function isAuthenticated(req, res, next) {
        if (req.session.user)
            return next();

        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.redirect('/');
    }

    app.get('/', function (req, res) {

        res.render('index', {
            title: 'Nodejs - Home'
        });

    });
    app.get('/signup', function (req, res) {

        res.render('signup', {
            title: 'Signup - Home'
        });

    });

    app.post('/resetPassword/:token', [
        check('password').custom((value, { req }) => {
            console.log(value, req.body, value !== req.body.confirmPassword)
            if (value !== req.body.confirmPassword) {
                throw new Error('Password confirmation is incorrect');
            }else {
                return true
            }
        })
    ], async function (req, res) {
        const errors = validationResult(req);
        console.log(errors)
        if (!errors.isEmpty()) {
            return res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json({error: errors});
        }
        let Person = wagner.get("Persons");
        let user = await Person.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        bcrypt.genSalt(10, async function (err, salt) {
            bcrypt.hash(req.body.password, salt, async function (err, hash) {
                user.password = hash
                await user.save();
            });
        })
        res.redirect('/');
        console.log("Post ResetPassword")
    })

    app.get('/reset/:token', async function (req, res) {
        let Person = wagner.get("Persons");
        const token = req.params.token;
        let user = await Person.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        if (!user) {
            res.render('error', {
                title: "404 Page not found",
                message: "Password reset token is invalid or expired."
            });
        } else {
            res.render('reset', {
                token,
                user
            });
        }
    });

};

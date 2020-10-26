// const jwt = require('jsonwebtoken');

// validateToken = (req, res, next) => {
//     const authorizationHeaader = req.headers.authorization;
//     let result;
//     if (authorizationHeaader) {
//       const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
//       const options = {
//           expiresIn: '1d'
//       };
//       try {
//           // verify makes sure that the token hasn't expired and has been issued by us
//         result = jwt.verify(token, "privatekey", options);

//         // Let's pass back the decoded token to the request object
//         req.decoded = result;
//         // We call next to pass execution to the subsequent middleware
//         next();
//     } catch (err) {
//         // Throw an error just in case anything goes wrong with verification
//         throw new Error(err);
//     }
// } else {
//       res.status(401).send({message:"Authentication error. Token required."});
//     }
// }
// module.exports = validateToken

const Promise = require('bluebird');
var bcrypt = require('bcryptjs');
var passport = require('passport');
const jwt = require('jsonwebtoken')
var LocalStrategy = require('passport-local').Strategy;
var logout = require('express-passport-logout');

ValidateToken = (function () {

    var global_wagner;

    function ValidateToken(wagner) {
        global_wagner = wagner;
    }

    validateToken = (req, res, next) => {
        const authorizationHeaader = req.headers.authorization;
        let result;
        if (authorizationHeaader) {
            const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
            const options = {
                expiresIn: '1d'
            };
            try {
                // verify makes sure that the token hasn't expired and has been issued by us
                result = jwt.verify(token, "privatekey", options);

                // Let's pass back the decoded token to the request object
                req.decoded = result;
                // We call next to pass execution to the subsequent middleware
                next();
            } catch (err) {
                // Throw an error just in case anything goes wrong with verification
                throw new Error(err);
            }
        } else {
            res.status(401).send({ message: "Authentication error. Token required." });
        }
    }

    return ValidateToken;

})();

module.exports = ValidateToken;

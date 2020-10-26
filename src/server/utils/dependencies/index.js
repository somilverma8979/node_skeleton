module.exports = function (wagner) {
    wagner.factory('PassPort', function () {
        var PassPort = require('./passport')
        return new PassPort(wagner)
    })

    wagner.factory('ValidateToken', function () {
        var ValidateToken = require('./validatetoken')
        return new ValidateToken(wagner)
    })
};

// const { Passport } = require('passport');

module.exports = function(wagner) {

  wagner.factory('User', function() {
    var User = require('./user');
    return new User(wagner);
  });

  wagner.factory('Auth', function() {
    var Auth = require('./auth');
    return new Auth(wagner);
  });

  wagner.factory('PassPort', function() {
    var PassPort = require('./passport')
    return new PassPort(wagner)
  })

};

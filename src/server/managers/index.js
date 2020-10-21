module.exports = function(wagner) {

  wagner.factory('User', function() {
    var User = require('./user');
    return new User(wagner);
  });

};

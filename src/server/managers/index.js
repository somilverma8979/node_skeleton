module.exports = function(wagner) {

  wagner.factory('User', function() {
    var User = require('./user');
    return new User(wagner);
  });

  wagner.factory('Auth', function() {
    var Auth = require('./auth');
    return new Auth(wagner);
  });
  
  wagner.factory('Schema', function() {
    var Schema = require('./schema');
    return new Schema.Schema(wagner);
  });

};

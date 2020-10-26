module.exports = function(wagner) {

  wagner.factory('User', function() {
    console.log("line 4")
    var User = require('./user');
    return new User(wagner);
  });

  wagner.factory('Auth', function() {
    console.log("line 10")
    var Auth = require('./auth');
    return new Auth(wagner);
  });
  
  wagner.factory('Schema', function() {
    console.log("line 16")
    var Schema = require('./schema');
    return new Schema.Schema(wagner);
  });

};

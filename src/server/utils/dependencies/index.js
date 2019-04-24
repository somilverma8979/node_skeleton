module.exports = function(wagner) {
  wagner.factory('SteemConnect', function() {
    var SteemConnect;
    SteemConnect = require('./SteemConnect');
    return new SteemConnect(wagner);
  });
};

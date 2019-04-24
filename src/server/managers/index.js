module.exports = function(wagner) {

  wagner.factory('Shop', function() {
    var ForeverPosts;
    ForeverPosts = require('./shop');
    return new ForeverPosts(wagner);
  });

};

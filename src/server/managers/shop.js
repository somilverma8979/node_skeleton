const Promise   = require('bluebird');
const config    = require('config');
const steem     = require('steem');
const _         = require('underscore');

Shop = (function() {

  var global_wagner;

  function Shop(wagner){
    global_wagner = wagner;
  }

  Shop.prototype["index"] = function(req) {
    return new Promise( function(resolve, reject) {
      resolve({"status":200,"list":[]});
    });
  };

  return Shop;

})();

module.exports = Shop;

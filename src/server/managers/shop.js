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

      var shop = global_wagner.get('shop');
      shop.findAll({attributes: ['shop_name', 'shop_url']}).then(result => {
          resolve(result);
      }).catch(error=> {
          reject(error);
      });

    });
  };

  return Shop;

})();

module.exports = Shop;

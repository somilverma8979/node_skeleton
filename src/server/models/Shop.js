module.exports = function(sequelize, DataTypes) {

    var fs              = require('fs');
    var path            = require('path');

    var shop_fields     = require(path.join(__dirname, './entity/shop.js'));
    var shop_meta       = require(path.join(__dirname, './table/shop.js'));
    var Shop            = sequelize.define('shop', shop_fields(),shop_meta());

    Shop.sync({force: false}).then(() => {
      // Table created
    });

    return Shop;

};

var fs = require('fs');
var _ = require('underscore');
var mongoose = require('mongoose')

module.exports = function (wagner) {

  var models = {};
  var excludeFiles = ["index.js", "entity", "table", "Shop.js"];
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (excludeFiles.indexOf(file) < 0);
    })
    .forEach(file => {
      // var model = (path.join(__dirname, file));
      var model = './' + file
      let model_name = file.split(".")[0]
      model = mongoose.model(model_name, require(model), model_name.toLowerCase());
      models[model_name] = model
    });

  // Object.keys(models).forEach(modelName => {
  //   if (models[modelName].associate) {
  //     models[modelName].associate(models);
  //   }
  // });
  _.each(models, (function (_this) {
    return function (value, key) {
      return wagner.factory(key, function () {
        return value;
      });
    };
  })(this));

  return models

};

// var _ = require('underscore');
// var Persons = require("./User")
// module.exports = function (wagner) {
//   var models = {
//     Persons: Persons
//   }
//   _.each(models, function (value, key) {
//     wagner.factory(key, function () {
//       return value;
//     });
//   });
//   return models;
// }
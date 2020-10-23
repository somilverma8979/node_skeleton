const validateToken = require("../utils/common/validatetoken")
module.exports = function (app, wagner) {
  require('./v1/user')(app, wagner, validateToken);
  require('./v1/auth')(app, wagner);
  require('./ui/index')(app, wagner);
};

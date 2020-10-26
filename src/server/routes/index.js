const validateToken = require("../utils/dependencies/validatetoken")
module.exports = function (app, wagner) {
  require('./v1/user')(app, wagner);
  require('./v1/auth')(app, wagner);
  require('./ui/index')(app, wagner);
  require('./v1/graphql')(app, wagner);
};

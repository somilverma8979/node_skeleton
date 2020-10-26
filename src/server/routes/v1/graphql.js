const HTTPStatus = require('http-status');
const { check, validationResult } = require('express-validator');


module.exports = function (app, wagner) {

  app.post('/graphql', [
    check('username').exists().withMessage("Username field is required."),
    check('password').exists().withMessage("Password field is required."),
  ], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json({ success: '0', message: "failure", data: errors });
    }
    wagner.get('Auth')["login"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log("Error =============", error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  })
};

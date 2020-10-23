const HTTPStatus = require('http-status');
const { check, validationResult } = require('express-validator');


module.exports = function (app, wagner) {

  app.post('/v1/auth/login', [
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

  app.post('/v1/auth/signUp', [
    // check('username').exists().withMessage("Username field is required."),
    check('username').custom(value => {
      console.log(value)
      var Persons = wagner.get('Persons')
      return Persons.findOne({username:value}).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
    check('password').exists().withMessage("Password field is required.")
  ], async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json({ success: '0', message: "failure", data: errors });
    }
    wagner.get('Auth')["signUp"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log("Error =============", error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

  app.post('/v1/auth/logout', async function (req, res) {
    wagner.get('Auth')["logout"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

  app.post('/v1/auth/resetPassword', [
    check('email_id').exists().withMessage("Username field is required."),
  ], async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json({ success: '0', message: "failure", data: errors });
    }
    wagner.get('Auth')["resetPassword"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

};

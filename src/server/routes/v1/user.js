const fs = require('fs');
const path = require('path');
const async = require('async');
const HTTPStatus = require('http-status');
const { check, validationResult } = require('express-validator');

module.exports = function (app, wagner) {

  app.get('/v1/shop', [
    check('full_name').isEmpty(),
    check('email_id').isEmpty().isEmail(),
    check('city').isEmpty(),
    check('password').isEmpty()
  ], function (req, res) {
    const errors = validationResult(req)
    console.log(errors)
    wagner.get('User')["index"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

  app.post('/v1/addUser', [
    check('full_name').exists().withMessage("Full name field is required."),
    check('email_id').exists().isEmail().withMessage("Email Id field is required."),
    check('city').exists().withMessage("City field is required."),
    check('password').exists().withMessage("Password field is required.")
  ], validateToken, function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json({ success: '0', message: "failure", data: errors });
    }
    wagner.get('User')["addUser"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

  app.get('/v1/getAllUsers', validateToken, function (req, res) {
    wagner.get('User')["getAllUsers"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

  app.put('/v1/updateUser', [
    check('full_name').exists().withMessage("Full name field is required."),
    check('email_id').exists().withMessage("Email id field is required."),
    check('city').exists().withMessage("City field is required."),
    check('userId').exists().withMessage("User id field is required.")
  ], validateToken, function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json({ success: '0', message: "failure", data: errors });
    }
    wagner.get('User')["updateUser"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

  app.delete('/v1/deleteUser', validateToken, function (req, res) {
    wagner.get('User')["deleteUser"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });
};

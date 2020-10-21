const fs = require('fs');
const path = require('path');
const async = require('async');
const HTTPStatus = require('http-status');

module.exports = function (app, wagner) {

  app.get('/v1/shop', function (req, res) {
    wagner.get('User')["index"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

  app.post('/v1/addUser', function (req, res) {
    wagner.get('User')["addUser"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

  app.get('/v1/getAllUsers', function (req, res) {
    wagner.get('User')["getAllUsers"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

  app.put('/v1/updateUser', function (req, res) {
    wagner.get('User')["updateUser"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

  app.delete('/v1/deleteUser', function (req, res) {
    wagner.get('User')["deleteUser"](req).then(function (result) {
      res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: result });
    }).catch(function (error) {
      console.log(error);
      res.status(HTTPStatus.NOT_FOUND).json({ success: '0', message: "failure", data: error });
    });
  });

};

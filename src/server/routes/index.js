module.exports = function(app, wagner) {
    require('./v1/shop')(app, wagner);
  	require('./ui/index')(app, wagner);
};

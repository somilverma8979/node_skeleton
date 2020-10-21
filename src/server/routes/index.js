module.exports = function(app, wagner) {
    require('./v1/user')(app, wagner);
  	require('./ui/index')(app, wagner);
};

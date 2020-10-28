require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const wagner = require('wagner-core');
const engine = require('ejs-mate');
const passport = require('passport');
const { graphqlHTTP } = require('express-graphql');
const { graphqlUploadExpress } = require('graphql-upload');


var app = express();
app.use(passport.initialize());
app.use(passport.session());
require('./server/utils/dependencies/passport')(wagner)
var schema = require('./server/managers/schema')
// new schema.Schema(wagner)
// Set PORT variable
const PORT = process.env.PORT || 3001;

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');
app.set('port', PORT);

// add sequelize ORM to wagner dependency manager
const sequelize = require('./server/utils/db')(wagner);
const dependencies = require('./server/utils/dependencies')(wagner);
// include the models, managers or any other utils here
require('./server/models')(wagner);
require('./server/managers')(wagner);
// app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 1 }));
app.use('/graphql', bodyParser.json(),
    //    apolloUploadExpress({ uploadDir: "./" }),
    // graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 1 }),
    graphqlHTTP({
        schema: schema.graphqlObj,
        graphiql: true,
    }), (req, res) => {
        console.log(req)
    });
// app.use('/graphql', (req, res, next) => {
//     return graphqlHTTP({
//         schema: schema.graphqlObj,
//         graphiql: true,
//         context: wagner.get("ValidateToken"),
//         tracing: true,
//         cacheControl: true,
//     })(req, res, next);
// });
wagner.get("Schema")
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static(__dirname+'/public'));
// include the routes path here
require('./server/routes')(app, wagner);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log(err.message);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'Nodejs - Internal Error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error.message', {
        message: err.message,
        error: {},
        title: 'Nodejs - Internal Error'
    });
});


// Set the PORT and start listening
app.set('port', process.env.PORT || PORT);
app.listen(app.get('port'));
// app.use('/graphql', graphqlHTTP({
//     //Directing express-graphql to use this schema to map out the graph 
//     schema,
//     //Directing express-graphql to use graphiql when goto '/graphql' address in the browser
//     //which provides an interface to make GraphQl queries
//     graphiql:true
// }));
console.log('Running on http://localhost:' + PORT);

// export the app instance
module.exports = app

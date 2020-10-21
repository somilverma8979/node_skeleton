const config = require('config');
const dbconfig = config.get('db');
const mongoose = require("mongoose");

module.exports = async function (wagner) {
    // return new Sequelize(dbconfig.database, dbconfig.username, dbconfig.password, dbconfig.options);
    const MONGOURI = dbconfig.mongo_uri
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to DB !!");
    } catch (e) {
        console.log(e);
        throw e;
    }

}

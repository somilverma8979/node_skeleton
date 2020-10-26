const mongoose = require("mongoose");
var author_schema = {
    name: {
        type: String
    },
    age: {
        type: Number
    }
}
module.exports = new mongoose.Schema(author_schema);
module.exports.author_schema = author_schema;
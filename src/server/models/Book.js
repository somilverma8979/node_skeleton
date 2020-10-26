const mongoose = require("mongoose");
var book_schema = {
    name: {
        type: String
    },
    pages: {
        type: Number
    },
    authorID: {
        type: String
    }
}
module.exports = new mongoose.Schema(book_schema);
module.exports.book_schema = book_schema;
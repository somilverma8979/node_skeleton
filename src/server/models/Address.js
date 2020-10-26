const mongoose = require("mongoose");
var address_schema = {
    full_name: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
    },
    password: {
        type: String,
    },
    city: {
        type: String,
    },
}
module.exports = new mongoose.Schema(address_schema);
module.exports.address_schema = address_schema;
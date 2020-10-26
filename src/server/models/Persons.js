const mongoose = require("mongoose");
var person_schema = {
    full_name: {
        type: String,
    },
    email_id: {
        type: String,
    },
    password: {
        type: String,
    },
    username: {
        type: String,
    },
    city: {
        type: String,
    },
    authToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}
module.exports = new mongoose.Schema(person_schema);
module.exports.person_schema = person_schema;
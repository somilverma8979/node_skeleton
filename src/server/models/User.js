const mongoose = require("mongoose");
var user_schema = {
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
module.exports = new mongoose.Schema(user_schema);
module.exports.user_schema = user_schema;
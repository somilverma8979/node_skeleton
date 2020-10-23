const mongoose = require("mongoose");
// const personSchema = mongoose.Schema;
// var Persons = new personSchema({
//     full_name: {
//         type: String,
//         required: true
//     },
//     email_id: {
//         type: String,
//     },
//     password: {
//         type: String,
//     },
//     city: {
//         type: String,
//     },
// });
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
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}
module.exports = new mongoose.Schema(person_schema);
module.exports.person_schema = person_schema;
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
module.exports = new mongoose.Schema(person_schema);
module.exports.person_schema = person_schema;
// module.exports = mongoose.model("Persons", Persons);
// export model user with UserSchema
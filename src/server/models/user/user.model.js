const mongoose = require("mongoose");
const personSchema = mongoose.Schema;
var Persons = new personSchema({
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
});

module.exports = mongoose.model("Persons", Persons);
// export model user with UserSchema
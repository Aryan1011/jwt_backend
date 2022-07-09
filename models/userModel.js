const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email:{type: String, required: true},
    name:{type: String, required: true},
    batch:{type: String, required: true},
    branch:{type: String, required: true},
    phone:{type: Number, required: true},
    about:{type: String, required: true},
    passwordHash: {type: String, required: true},
});
const User = mongoose.model("user",userSchema);
module.exports = User;
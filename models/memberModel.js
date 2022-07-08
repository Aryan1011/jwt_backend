const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    name:{type: String, required: true},
});
const Member = mongoose.model("member",memberSchema);
module.exports = Member;

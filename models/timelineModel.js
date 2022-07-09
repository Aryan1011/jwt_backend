const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema({
    name:{type: String, required: true},
});
const Timeline = mongoose.model("timeline",timelineSchema);
module.exports = Timeline;

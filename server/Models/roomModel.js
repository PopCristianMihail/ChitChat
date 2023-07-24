const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        members:{
            type: Array,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
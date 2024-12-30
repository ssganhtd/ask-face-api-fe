const mongoose = require("mongoose");

const Face = mongoose.model(
    "face",
    new mongoose.Schema({
        title: { type: String, default: null },
        data: { type: String, required: true, unique: true },
    })
);

module.exports = Face;
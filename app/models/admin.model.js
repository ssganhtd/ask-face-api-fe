const mongoose = require("mongoose");

const User = mongoose.model(
    "admin",
    new mongoose.Schema({
        fullname: { type: String, default: null },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'admin' },
        verified: { type: Boolean, default: false },
        status: { type: Boolean, default: true },
        created: { type: Date, default: Date.now },
    })
);

module.exports = User;
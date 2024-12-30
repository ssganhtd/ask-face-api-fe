const mongoose = require("mongoose");

const User = mongoose.model(
    "user",
    new mongoose.Schema({
        fullname: { type: String, default: null },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, default: null },
        verify_token: { type: String, default: null },
        verify_at: { type: Date, default: null },
        verified: { type: Boolean, default: false },
        status: { type: Boolean, default: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: null },
    })
);

module.exports = User;
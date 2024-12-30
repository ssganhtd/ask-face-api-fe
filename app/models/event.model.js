const mongoose = require("mongoose");

const Event = mongoose.model(
    "event",
    new mongoose.Schema({
        title: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        description: { type: String, default: null },
        featured_image: { type: String, default: null },
        public: { type: Boolean, default: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: null },
    })
);

module.exports = Event;
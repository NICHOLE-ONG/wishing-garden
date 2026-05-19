const mongoose = require("mongoose");

const wishSchema = new mongoose.Schema({
    message: {
        type: String,
        required: false
    },

    createdBy: {
        type: String,
        default: "Anonymous"
    },

    strokes: [
        {
            points: [
                { x: Number, y: Number }
            ],
            color: String
        }
    ],

    position: {
        x: Number,
        y: Number
    },

    waterCount: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Wish", wishSchema);
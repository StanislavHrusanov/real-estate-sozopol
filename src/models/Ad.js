const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }

    }],
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    info: {
        type: String
    }
});

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
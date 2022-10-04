const mongoose = require('mongoose')

const categoriesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    cardNumber: {
        type: Number,
        // require: true,
        // max: 16
    },
    exp_month: {
        type: String,
        // required: true,
    },
    exp_year: {
        type: Number,
        // required: true,
    },
    cvv: {
        type: Number,
        // required: true,
        // max: 4
    },
},
    { timestamps: true }
);

const CardDetails = mongoose.model('CardDetails', categoriesSchema)

module.exports = CardDetails








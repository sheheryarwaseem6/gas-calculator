const mongoose = require('mongoose')
const Car = require ('./Car')

const HistorySchema = new mongoose.Schema({
    fromdate: {
        type: String,
        req: true
    },
    todate: {
        type: String,
        req: true
    },
    totalPrice: {
        type: Number,
        req: true
    },
    totalQty: {
        type: Number,
        req: true
    },
 
    carId: {
        type: String
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
   
    }, { timestamps: true });
   




const History = mongoose.model('History', HistorySchema);

module.exports = History

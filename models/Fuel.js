const mongoose = require('mongoose')
const Car = require ('./Car')

const fuelSchema = new mongoose.Schema({
    
        userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    fuelPrice: {
        type: Number,
        req: true
    },
    fuelQuantity: {
        type: Number,
        req: true
    },
 
    carId: {
        type : mongoose.Schema.Types.ObjectId,
        ref:"Car"
    }
   
    }, { timestamps: true });
   




const Fuel = mongoose.model('Fuel', fuelSchema)

module.exports = Fuel

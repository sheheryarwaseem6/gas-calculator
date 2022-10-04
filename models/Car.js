const mongoose = require('mongoose')
const User = require('./User')

const carSchema = new mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'

    },
    carName : {
        type : String,
        required: true

    },
    carNumber :{
        type : String,
        required: true

    },
    carModel :{
        type : String,
        required: true
    },
    carImage: {
        type: String,
        required: false
    }
},
{timestamps : true})

const Car = mongoose.model("Car", carSchema)

module.exports = Car
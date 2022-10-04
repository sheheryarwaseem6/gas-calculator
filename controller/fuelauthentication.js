const Fuel = require('../models/Fuel')
const History = require('../models/History')
var moment = require('moment')

const addFuel = async (req, res) => {
    try {
        if (!req.body.fuelPrice) {
            return res.status(400).json({
                status: 0,
                message: "Fuel Price is required"
            })
        }
        else if (!req.body.fuelQuantity) {
            return res.status(400).json({
                status: 0,
                message: "Fuel Quantity is required"
            })
        }
        // else if (!req.body.FuelDate) {
        //     return res.status(400).json({
        //         status: 0,
        //         message: "Fuel Date is required"
        //     })
        // }

        else if (!req.body.carId) {
            return res.status(400).json({
                status: 0,
                message: "carId is required"
            })
        }
        // var dateObj = new Date();
        // var month = dateObj.getUTCMonth() + 1; //months from 1-12
        // var day = dateObj.getUTCDate();
        // var year = dateObj.getUTCFullYear();

        // newdate = year + "/" + month + "/" + day;

        const fuel = new Fuel()
        fuel.userId = req.user._id
        fuel.fuelPrice = req.body.fuelPrice
        fuel.fuelQuantity = req.body.fuelQuantity
        fuel.carId = req.body.carId

        const addFuel = await fuel.save()

        if (addFuel) {
            return res.status(200).json({
                status: 1,
                message: "Fuel added Successfully"
            })
        }
        else {
            return res.status(400).json({
                status: 0,
                message: "Fuel didnt added"
            })
        }

    } catch (error) {
        return res.status(400).json({
            status: 0,
            message: error.message
        })
    }
}

const getFuel = async (req, res) => {
    try {
        const car = await Fuel.find({ carId: req.params.carId })

        // console.log(car)

        return res.status(200).json({
            status: 1,
            message: "Success",
            car
        })

    } catch (error) {
        return res.status(400).json({
            status: 0,
            message: error.message
        })
    }

}

//calculate fuel
const calFuel = async (req, res) => {
    try {
        if (!req.body.fromdate) {
            return res.status(400).json({
                status: 0,
                message: "Fromdate field is required"
            })
        }
        else if (!req.body.todate) {
            return res.status(400).json({
                status: 0,
                message: "Todate field is required"
            })
        }

        // console.log(newdate)
        //     var datetime = new Date();
        // console.log(datetime.toISOString().slice(0,10));

        // const fuel = await Fuel.find({ carId: req.body.carId },{fromdate : $gte = Date })
        // console.log(req.body)
        let todate = `${req.body.todate}T24:00:00.000+00:00`
        // console.log(time)
        const fuel = await Fuel.find(
            {
                $and: [
                    { userId: req.user._id },
                    { createdAt: { $exists: true, $gt: req.body.fromdate } },
                    { createdAt: { $exists: true, $lt: todate } }

                ]
            }
        )
        
        console.log("fuel", fuel)

        const count = await Fuel.find(
            {
                $and: [
                    { userId: req.user._id },
                    { createdAt: { $lte: todate } },
                    { createdAt: { $gt: req.body.fromdate } }

                ]
            }
        ).count()


        const totalPrice = fuel.reduce(function (accumulator, curValue) {
            return accumulator + curValue.fuelPrice
        }, 0)

        const totalQty = fuel.reduce(function (accumulator, curValue) {
            return accumulator + curValue.fuelQuantity
        }, 0)
        // console.log(fuel)
        // console.log(totalPrice);
        // console.log(totalQty);
        const history = new History({
            userId: req.user._id,
            totalPrice: totalPrice,
            totalQty: totalQty,
            fromdate: req.body.fromdate,
            todate: req.body.todate,
        })
        await history.save()


        return res.status(200).json({
            status: 1,
            count: count,
            totalPrice: totalPrice,
            totalQuntity: totalQty,
            message: "Success",
            fuel,
        })



    } catch (error) {
        return res.status(400).json({
            status: 0,
            message: error.message
        })
    }
}

const getByMonth = async (req, res) => {
    try {
        const arr = []
        const fuel = await Fuel.find({userId: req.user._id})
        // console.log(fuel)
        var sum = 0
        var sum1 = 0
        var sum2 = 0
        var sum3 = 0
        var sum4 = 0
        var sum5 = 0
        var sum6 = 0
        var sum7 = 0
        var sum8 = 0
        var sum9 = 0
        var sum10 = 0
        var sum11 = 0
        fuel.forEach(item => {
            if (moment(item.createdAt).format("MM") == 01) {
                sum += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 02) {
                sum1 += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 03) {
                sum2 += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 04) {
                sum3 += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 05) {
                sum4 += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 06) {
                sum5 += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 07) {
                sum6 += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 08) {
                sum7 += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 09) {
                sum8 += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 10) {
                sum9 += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 11) {
                sum10 += item.fuelQuantity;
            }
            if (moment(item.createdAt).format("MM") == 12) {
                sum11 += item.fuelQuantity;
            }

        })
        arr.push({ month: "January", sum: sum })
        arr.push({ month: "February", sum: sum1 })
        arr.push({ month: "March", sum: sum2 })
        arr.push({ month: "April", sum: sum3 })
        arr.push({ month: "May", sum: sum4 })
        arr.push({ month: "June", sum: sum5 })
        arr.push({ month: "July", sum: sum6 })
        arr.push({ month: "August", sum: sum7 })
        arr.push({ month: "September", sum: sum8 })
        arr.push({ month: "October", sum: sum9 })
        arr.push({ month: "November", sum: sum10 })
        arr.push({ month: "December", sum: sum11 })
        return res.status(200).json({ status: 1, message: "data is available", fuel: arr })

    }
    catch (error) {
        return res.status(400).json({ status: 0, message: error })
    }
}

//get history by carId
const getHistory = async (req, res) => {
    try {
        // const today = new Date();

        // const month = today.getMonth();     // 10 (Month is 0-based, so 10 means 11th Month)
        // console.log(month)

        const history = await History.find({userId: req.user._id})

        // for (let i = 1; i < 12; i++) {
        //     var history = await History.find({
        //         $and: [
        //             { carId: req.body.carId },
        //             { fromdate: { $lte: `2022-0${i}-01` } },
        //             { todate: { $gte: `2022-0${i + 1}-01` } }

        //         ]
        //     })
        //     console.log(history)
        // }

        // return res.status(200).json({ status: 'OK', history: history })


        // const history = await History.find({ carId: req.body.carId })
        // console.log(history)

        if (history) {
            return res.status(200).json({
                status: 1,
                message: "Success",
                history
            })

        }
        else {
            return res.status(400).json({
                status: 0,
                message: "data not found"
            })
        }

    } catch (error) {
        return res.status(400).json(error)
    }
}


const state = async (req, res) => {
    try {
        const history = await History.find({ carId: req.body.carId })
        // console.log(history)

        if (history) {
            return res.status(200).json({
                status: 1,
                message: "Success",
                history
            })

        }
        else {
            return res.status(400).json({
                status: 0,
                message: "data not found"
            })
        }

    } catch (error) {
        return res.status(400).json(error)
    }
}



module.exports = { addFuel, getFuel, calFuel, getHistory, state, getByMonth }
// const { History } = require('../models/History');

// //calculate fuel
// const calFuel = async (req, res) => {
//     try {
//         if (!req.body.fromdate) {
//             return res.status(400).json({
//                 status: 0,
//                 message: "Fromdate field is required"
//             })
//         }
//         else if (!req.body.todate) {
//             return res.status(400).json({
//                 status: 0,
//                 message: "Todate field is required"
//             })
//         }
//         fromdate = req.body.fromdate
//         todate = req.body.todate

//         // console.log(newdate)
//         //     var datetime = new Date();
//         // console.log(datetime.toISOString().slice(0,10));

//         // const fuel = await Fuel.find({ carId: req.body.carId },{fromdate : $gte = Date })
//         const fuel = await Fuel.find(
//             {
//                 $and: [
//                     { carId: req.body.carId },
//                     { createdAt: { $lte: req.body.todate } },
//                     { createdAt: { $gte: req.body.fromdate } }

//                 ]
//             }
//         )

//         const totalPrice = fuel.reduce(function (accumulator, curValue) {
//             return accumulator + curValue.fuelPrice
//         }, 0)

//         const totalQty = fuel.reduce(function (accumulator, curValue) {
//             return accumulator + curValue.fuelQuantity
//         }, 0)
//         console.log(fuel)
//         console.log(totalPrice);
//         console.log(totalQty);
//         return res.status(200).json({
//             status: 1,
//             totalPrice: totalPrice,
//             totalQuntity: totalQty,
//             message: "Success",
//             fuel,
//         })


//     } catch (error) {
//         return res.status(400).json({
//             status: 0,
//             message: error.message
//         })
//     }
// }

// module.exports = { calFuel }
const { findById, findByIdAndDelete } = require('../models/Car')
const Car = require('../models/Car')
const Fuel = require('../models/Fuel')


const addCar = async (req, res) => {
    try {
        console.log(req.user.id)
        if (!req.body.carName) {
            return res.status(400).send({
                status: 0,
                message: "Car Name is required"
            })
        }
        else if (!req.body.carNumber) {
            return res.status(400).send({
                status: 0,
                message: "Car Number is required"

            })

        }
        else if (!req.body.carModel) {
            return res.status(400).send({
                status: 0,
                message: "Car Model is required"
            })
        }
        else {

            const car = new Car()
            car.carName = req.body.carName
            car.carNumber = req.body.carNumber
            car.carModel = req.body.carModel
            car.carImage = req.file.path
            car.userId = req.user._id

            const addCar = await car.save()

            if (addCar) {
                return res.status(200).send({
                    status: 1,
                    message: "Car added Successfully"
                })
            }
            else {
                return res.status(400).send({
                    status: 0,
                    message: "Car didnt added"
                })

            }
        }
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            message: error
        })
    }
}

const updateCar = async (req, res) => {
    try {


        if (!req.body.car_id) {
            return res.status(400).json({ status: 0, msg: "Car id is requried" })
        }


        const car = await Car.findByIdAndUpdate({ _id: req.body.car_id },
        {carName : req.body.carName,
        carNumber : req.body.carNumber,
        carModel : req.body.carModel,
        carImage : req.file ? req.file.path : req.body.image}, {new: true}
        )
        if (car.length < 1) {
            return res.status(400).json({ status: 0, msg: "This car is not available" })
        }
        else {

            // car.carName = req.body.carName
            // car.carNumber = req.body.carNumber
            // car.carModel = req.body.carModel
            // car.carImage = req.file ? req.file.path : req.body.image

            
            // const updatedCar = await car.save()
            if (car) {
                return res.status(200).json({ status: 1, msg: "Car updated successfully", data: car })
            } else {
                return res.status(400).json({ status: 0, msg: "Something went wrong" })
            }
        }
    }
    catch (error) {
        return res.status(400).send({ status: 0, message: error.message });


    }
}

const deleteCar = async(req, res)=> {
    try {
        const deletecar =await Car.findByIdAndDelete({_id : req.body.car_id})

        if(deletecar) {
            return res.status(200).json({status: 1, message: "Car deleted successfully"})
        } 
        else {
            return res.status(404).json({status: 0, message: "Car not found"})
        }

    } catch (error) {
        return res.status(400).json({status: 0, message: error.message})
    }
}

const allCars = async(req, res) => {
    try {
        const cars = await Car.find({userId : req.userId})
        if(cars){
            return res.status(200).json({ status: 1, message: "Success", data: cars })
        }
        else{
            return res.status(400).json({ status: 0, message: "No car found in this user"})
        }

    } catch (error) {
        return res.status(400).json({
            status: 0,
            message: 'No record Found'
        });
    }
}

const carDetails = async (req , res)=>{
    try{
        const cardetail = await Car.findOne({_id: req.params._id})
        
        
        if(cardetail){
            // const fueldetails = await Fuel.find({_id : req.body.id})
            res.status(200).send({
                status : 1,
                data:
                    cardetail
                
            })
        }
        else{
            res.status(404).send({
                status: 0,
                message: 'car details not found.'
            });
        }

    }
        catch(error){
        res.status(400).send({
            status : 0,
            message: error
        });

    }

}

module.exports = { addCar, updateCar, deleteCar, allCars, carDetails }
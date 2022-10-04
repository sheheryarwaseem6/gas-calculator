const Card = require('../models/Card')

//Add Category 
const addCardDetails = async (req, res) => {
    try {
        if (!req.body.cardNumber) {
            return res.status(400).send({
                status: 0,
                message: "cardNumber is required"
            })
        }
        else if (!req.body.exp_month) {
            return res.status(400).send({
                status: 0,
                message: "exp_month is required"
            })
        }
        else if (!req.body.exp_year) {
            return res.status(400).send({
                status: 0,
                message: "exp_year is required"
            })
        }
        else if (!req.body.cvv) {
            return res.status(400).send({
                status: 0,
                message: "cvv is required"
            })
        }
        else if (req.body.cardNumber.length > 16) {
            return res.status(400).send({
                status: 0,
                message: "cardNumber length exceeds"
            })
        }
        else if (req.body.cvv.length > 4) {
            return res.status(400).send({
                status: 0,
                message: "cvv length exceeds"
            })
        }
        else {
            // const findCard = await Card.findOne({ cardNumber: req.body.cardNumber })
            

            const card = await Card.findOne({ cardNumber: req.body.cardNumber })

            if (card) {
                return res.status(400).send({
                    status: 1,
                    message: "Card already exists"
                })
            }
            else {

                const newcard = new Card({
                    userId: req.user._id,
                    cardNumber: req.body.cardNumber,
                    cvv: req.body.cvv,
                    exp_year: req.body.exp_year,
                    exp_month: req.body.exp_month
                })
                


                await newcard.save()
                return res.status(200).send({
                    status: 1,
                    message: "Card Added Successfully",
                    newcard
                })
                // console.log(findCard)
                // if (newcard) {
                //     // console.log(findCatogory)
                //     return res.status(400).send({
                //         status: 1,
                //         message: "Card Added Successfully",
                //         newcard
                //     })
                // }
                // findCard.save()
                // const card = await findCard.save({
                //     cardNumber: req.body.cardNumber, userId: req.user._id,
                //     exp_month: req.body.exp_month, exp_year: req.body.exp_year, cvv: req.body.cvv
                // })
                // if (card) {
                //     res.status(200).send({
                //         status: 1,
                //         message: "Card added successfully"
                //     })
                // }
                // else {
                //     return res.status(400).send({
                //         status: 0,
                //         message: "Something went wrong"
                //     })
                // }
            }
        }
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            message: error.message
        })
    }
}
module.exports = {
    addCardDetails,
}
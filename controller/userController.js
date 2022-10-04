const { User } = require('../models/User');

const updateProfile = async(req,res) => {
    try {
        
        const user = await User.findByIdAndUpdate({_id: req.user._id}, {full_name: req.body.full_name, image: (req.file ? req.file.path : req.body.image)},{new:true})
 
        if(user) {
            return res.status(200).json({
                status: 1,
                message: "Profile Updated",
                user:user
            })
        }

    } catch (error) {
        return res.status(400).json({
            status: 0,
            message: error.message
        })
    }
}

const getProfile = async(req,res) => {
    try {
        const user = await User.findOne({_id: req.user._id}).select('full_name  user_email image ')
        console.log(user)
        if(user) {
            return res.status(200).json({
                status: 1,
                message: "user detail",
                user
            })
        }
        else {
            return res.status(400).json({
                status: 0,
                message: "User Not Found",
                
            })
        }
        



    } catch (error) {
        return res.status(400).send(error.message)
    }
}




    module.exports = { updateProfile, getProfile }
const { User } = require('../models/User');
const bcrypt = require('bcryptjs')
const { sendEmail } = require('../config/mailer')

//social login
const socialLogin = async (req, res) => {
    try {
        const alreadyUserAsSocialToke = await User.findOne({ user_social_token: req.body.user_social_token })
        if (alreadyUserAsSocialToke) {
            if (alreadyUserAsSocialToke.user_type !== req.body.user_type) {
                return res.status(400).send({ status: 0, message: "Invalid User Type!" });
            }
        }
        if (!req.body.user_social_token) {
            return res.status(400).send({ status: 0, message: 'User Social Token field is required' });
        }
        else if (!req.body.user_social_type) {
            return res.status(400).send({ status: 0, message: 'User Social Type field is required' });
        }
        else if (!req.body.user_device_type) {
            return res.status(400).send({ status: 0, message: 'User Device Type field is required' });
        }
        else if (!req.body.user_device_token) {
            return res.status(400).send({ status: 0, message: 'User Device Token field is required' });
        }
        else {
            const checkUser = await User.findOne({ user_social_token: req.body.user_social_token });
            if (!checkUser) {
                const newRecord = new User();
                // if(req.file){
                //     newRecord.user_image    = req.file.path
                //  }
                // const customer = await stripe.customers.create({
                //     description: 'New Customer Created',
                // });
                // newRecord.stripe_id = customer.id;
                // newRecord.user_image = req.body.user_image ? req.body.user_image : ""
                // newRecord.user_image = req.body.user_image
                    newRecord.image = req.file ? req.file.path : req.body.image,
                    newRecord.user_social_token = req.body.user_social_token,
                    newRecord.user_social_type = req.body.user_social_type,
                    newRecord.user_device_type = req.body.user_device_type,
                    newRecord.user_device_token = req.body.user_device_token
                    newRecord.full_name = req.body.full_name,
                    newRecord.email = req.body.email,
                    //newRecord.user_type = req.body.user_type,
                    newRecord.verified = 1
                await newRecord.generateAuthToken();
                const saveLogin = await newRecord.save();
                return res.
                    status(200)
                    .send({
                        status: 1,
                        message: 'Login Successfully',
                        user: saveLogin
                    });
            } else {
                const token = await checkUser.generateAuthToken();
                const upatedRecord = await User.findOneAndUpdate(
                    { _id: checkUser._id },
                    {
                        user_device_type: req.body.user_device_type,
                        user_device_token: req.body.user_device_token,
                        full_name : req.body.full_name,
                        verified: 1,
                        user_authentication: token
                    }
                    ,
                    { new: true });
                return res
                    .status(200)
                    .json({
                        status: 1,
                        message: 'Login Successfully',
                        token: token,
                        user: upatedRecord
                    })
            }
        }
    }
    catch (error) {
        console.log('error *** ', error);
        res.status(400).json({
            status: 0,
            message: error.message
        });
    }
}


//signup
const signup = async (req, res) => {
    try {

        if (!req.body.full_name) {
            return res.status(400).json({ status: 0, msg: "Full name is required" })

        } else if (!req.body.user_email) {
            return res.status(400).json({ status: 0, msg: "Email is required" })
        } else if (!req.body.user_password) {
            return res.status(400).json({ status: 0, msg: "Password is required" })
        } 
        // else if (req.body.user_password !== req.body.confirm_password) {
        //     return res.status(400).json({ status: 0, msg: "Password Mismatch" })
        // }

        const user = await User.findOne({ user_email: req.body.user_email })
        if (user) {
            return res.status(400).json({ status: 0, msg: "Email already exist" })
        } else {

            const hash_password = await bcrypt.hash(req.body.user_password, 10)
            const verificationCode = 123456;

            const newUser = new User({
                full_name: req.body.full_name,
                user_email: req.body.user_email,
                user_password: hash_password,
                code:verificationCode

            })
            const token = await newUser.generateAuthToken()
            await newUser.save()
            return res.status(201).json({ status: 1, msg: "Account created", user: newUser })
        }

    }

    catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message })
    }
}


//login
const login = async (req, res) => {
    try {
        if (!req.body.user_email) {
            return res.status(404).json({ status: 0, msg: "Email is required" })
        } else if (!req.body.user_password) {
            return res.status(404).json({ status: 0, msg: "Password is required" })
        } else {
            const user = await User.findOne({ user_email: req.body.user_email })
            if (!user) {
                return res.status(404).json({ status: 0, msg: "User not found" })
            } else {
                const isMatch = await bcrypt.compare(req.body.user_password, user.user_password)
                if (!isMatch) {
                    return res.status(404).json({ status: 0, msg: "Password not match" })
                } else {
                    // user.user_authentication = null
                    const token = await user.generateAuthToken()
                    return res.status(200).json({ status: 1, msg: "User Login Successful", user })
                }
            }
        }
    } catch (error) {
        
        return res.status(400).json({ status: 0, message: error.message })
    }
}


//Forget Password
const forgetPassword = async (req, res) => {
    try {
        if (!req.body.user_email) {
            return res.status(400).json({ status: 0, msg: "Email is required" });
        } else {
            const user = await User.findOne({ user_email: req.body.user_email })
            if (!user) {
                return res.status(400).json({ status: 0, msg: "User not found" });
            } else {
                // const verficationCode = Math.floor(10000 + Math.random() * 900000)
                const verficationCode = 123456
                const newUser = await User.findByIdAndUpdate({ _id: user._id }, { code: verficationCode })
                if (newUser) {
                    sendEmail(user.user_email, verficationCode, "Forget Password")
                    return res.status(200).json({ status: 1, msg: "Code successfully send to email : 123456" , userId: newUser._id })
                } else {
                    return res.status(200).json({ status: 0, msg: "Something went wrong" })
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}

//verifyOTP 
const verifyPassword = async (req, res) => {
    try {
        if (!req.body.user_id) {
            return res.status(400).json({ status: 0, message: "User ID is required" })
        } else if (!req.body.verificationcode) {
            return res.status(400).json({ status: 0, message: "Verification code is required" })
        }
        await User.findOne({ _id: req.body.user_id }).then((result) => {

            if (req.body.verificationcode == result.code) {
                User.findByIdAndUpdate({ _id: req.body.user_id }, { verified: 1, code: null },{new:true}, (err, result) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(400).json({ status: 0, message: "Something went wrong", err });
                    }
                    if (result) {
                        return res.status(200).json({ status: 1, message: "OTP matched successfully",data:result })
                    }
                })
            } else {
                return res.status(400).json({ status: 0, message: "OTP not matched" })
            }
        }).catch((err) => {
            console.log(err.message);
            return res.status(400).json({ status: 0, message: "Verification not matched" })
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });

    }
}


//changePassword
const changePassword = async (req, res) => {
    try {
        if (!req.body.new_password) {
            return res.status(400).json({ status: 0, message: "Enter New Password" });
        }
        const user = await User.findById(req.body.user_id)
       
            const hash_password = await bcrypt.hash(req.body.new_password, 10)
            const newUser = await User.findByIdAndUpdate({ _id: req.body.user_id }, { user_password: hash_password })
            await newUser.save()

            return res.status(200).json({ status: 1, message: "Password changed successfully" })
        

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
    }
}


// Update Password
const updatePassword = async (req, res) => {
    try {

        // else if (req.body.user_authentication.length === 0) {
        //     res.send({ status: 0, message: 'Authentication field is required' });
        // }
        if (!req.body.old_password) {
            res.send({ status: 0, message: 'Old Password field is required' });
        }
        else if (!req.body.new_password) {
            res.send({ status: 0, message: 'New Password field is required' });
        }
        else {
            // const userFind = await User.findOne({ _id: req.body.user_id, user_authentication: req.body.user_authentication });
            const userFind = await User.findOne({ _id: req.user._id });

            if (userFind) {
                const user_password = await bcrypt.compare(req.body.old_password, userFind.user_password);
                if (userFind && user_password == true) {
                    const newPassword = await bcrypt.hash(req.body.new_password, 8);
                    await User.findOneAndUpdate({ _id: req.user._id }, { user_password: newPassword });
                    res.status(200).send({ status: 1, message: 'New password Updated Successfully.' });
                }
                else {
                    res.status(400).send({ status: 0, message: 'Password Not Match' });
                }
            } else {
                res.status(400).send({ status: 0, message: 'Something Went Wrong.' });
            }
        }
    }
    catch (error) {
        res.status(400).send({
            status: 0,
            message: error
        });
    }
}

//Resend Code
const resendCode = async (req, res) => {
    if(!req.body.user_id){
        return res.status(400).send({ status: 0, message: 'User id failed is required.' });
    }
    else{
        User.find({ _id: req.body.user_id })
        .exec()
        .then(result => {
            //const verificationCode = Math.floor(100000 + Math.random() * 900000);
            const verificationCode = 123456
    
            User.findByIdAndUpdate(req.body.user_id, { verified: 0, code: verificationCode }, (err, _result) => {
                if(err){
                    return res.status(400).send({ status: 0, message: 'Something went wrong.' });
                }
                if(_result){
                    sendEmail(result[0].user_email, verificationCode, "Verification Code Resend");
                    return res.status(200).send({ status: 1, message: 'Verification code resend successfully.' ,code: 
                    verificationCode });
                }
            });
        })
        .catch(err => {
            res.status(400).send({
                status: 0, 
                message: 'User not found' 
            });
        });
    }
}

//logout
const logout = async (req , res) =>{
    try {
        //if (!req.body._id) {
        //     res.status(400).send({ status: 0, message: 'User ID field is required' });
        // }
        // else if (!req.headers.authorization) {
        //     res.status(400).send({ status: 0, message: 'Authentication Field is required' });
        // }
            const updateUser = await User.findOneAndUpdate({ _id: req.user._id }, {
                user_authentication: null,
                user_device_type: null,
                user_device_token: null
            });
            res.status(200).send({ status: 1, message: 'User logout Successfully.' });
    } catch (e) {
        res.status(400).send(e.message);
    }
}

module.exports = { signup, login, socialLogin, forgetPassword, verifyPassword, changePassword, updatePassword, resendCode,  logout  }
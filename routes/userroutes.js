const router = require('express').Router();
const { signup, login, socialLogin, forgetPassword, verifyPassword, changePassword, updatePassword, resendCode, logout } = require("../controller/userauthentication");
const { verifyToken } = require('../middleware/authenticate')
const { addCar, updateCar, deleteCar, allCars, carDetails } = require('../controller/car')
const {updateProfile, getProfile} = require('../controller/userController')
const { addFuel, getFuel, calFuel, getHistory, getByMonth  } = require('../controller/fuelauthentication')
const { getContent } = require('../controller/commonController');
const { upload } = require("../config/multer")
const { addCardDetails } = require("../controller/cardController")
// const { calFuel} = require("../controller/historyfuelController")

//registration routes
router.post("/signup", signup)
router.post("/login", login)
router.post("/socialLogin", socialLogin)
router.post("/forgotPassword", forgetPassword)
router.post("/verifyOtp", verifyPassword)
router.post("/resendCode", resendCode)
router.put("/changePassword", changePassword)
router.put("/updatePassword", verifyToken, updatePassword)
router.post("/logout", verifyToken, logout)

//user routes
router.post("/updateProfile", verifyToken, upload.single("image"),updateProfile)
router.get('/getprofile', verifyToken, getProfile)

//car routes
router.post("/addCar", verifyToken, upload.single("carImage"), addCar)
router.put("/updateCar", verifyToken,upload.single("carImage"), updateCar)
router.delete("/deleteCar", verifyToken, deleteCar)
router.get("/allCars", verifyToken, allCars)
router.get("/carDetails/:_id", verifyToken, carDetails)

//fuel routes
router.post("/addFuel", verifyToken, addFuel)
router.get("/getFuel/:carId", verifyToken, getFuel)
router.post("/calFuel", verifyToken, calFuel)
router.get('/gethistory', verifyToken, getHistory)
router.get('/getbymonth', verifyToken, getByMonth)

//content routes
router.get('/get-content/:type', getContent);

//carddetails
router.post('/addCardDetails', verifyToken, addCardDetails)


module.exports = router
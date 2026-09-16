const express = require("express");
const {authController,loginuserController,logoutuserController,getMeController} = require("../controllers/auth.Controller");
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();

// router

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", authController);

/**
 * @route POST /api/auth/login
 * @description login user
 * @access Public
 */

router.post("/login", loginuserController);

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

router.get("/logout", logoutuserController);

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */

router.get("/getme", authMiddleware.authUser,getMeController);

module.exports = router;

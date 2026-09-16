const userModel = require("../models/use.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

// registerUserController

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
const authController = async (req, res) => {
  try {
    // 1.register
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "please enter all required fields",
      });
    }
    // 2.check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "user already exists",
      });
    }
    // 3.hashpassword
    const hashpassword = await bcrypt.hash(password, 10);
    // 4.save password
    const user = new userModel({
      userName,
      email,
      password: hashpassword,
    });
    await user.save();

    // 5.token genarate
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // 6.set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined; //for not showing the password
    // 7.responce
    res.status(201).send({
      success: true,
      message: "user registered",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in authController",
    });
  }
};

// loginUserController

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */

const loginuserController = async (req, res) => {
  try {
    // 1.register
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "please enter valid email and password",
      });
    }
    // 2.check existing user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }
    // 3.compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "invalid email or password",
      });
    }
    // 4.token genarate
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // 5.set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined; //for not showing the password

    // 6.responce
    return res.status(200).json({
      success: true,
      message: "user login successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in login user",
    });
  }
};

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

const logoutuserController = async (req, res) => {
  try {
    // 1. cookie se token nikaalo
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).send({
        success: false,
        message: "no token found",
      });
    }

    // 2. token ko blacklist me daalo
    // await blacklistTokenModel.create({ token });

    // 3. cookie clear karo
    res.clearCookie("token");

    // 4. response
    return res.status(200).send({
      success: true,
      message: "user logged out successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in logout user",
    });
  }
};

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */

const getMeController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
      message: "User details fetched successfully",
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "error to get ",
    });
  }
};

module.exports = {
  authController,
  loginuserController,
  logoutuserController,
  getMeController,
};

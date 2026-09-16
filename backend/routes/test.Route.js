const express = require("express")
const { testController } = require("../controllers/test.Controller")
const router = express.Router()

// route
router.get("/test-route",testController)

module.exports = router
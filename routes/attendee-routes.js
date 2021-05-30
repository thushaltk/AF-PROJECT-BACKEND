const express = require("express");
const { check } = require('express-validator');

const router = express.Router();

//Controller
const attendeeControllers = require("../controllers/attendee-controller");

router.post("/add-attendee", 
[
    check('fullName').not().isEmpty(),
    check('address').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('mobileNo').isLength({max: 10}),
    check('isPaid').not().isEmpty()
]
,attendeeControllers.addAttendeeDetails);

router.get("/", attendeeControllers.getAllAttendeeDetails),

module.exports = router;
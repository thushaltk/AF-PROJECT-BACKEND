const express = require("express");

const router = express.Router();

//Controller
const attendeeControllers = require("../controllers/attendee-controller");

router.post("/add-attendee", attendeeControllers.addAttendeeDetails);

module.exports = router;
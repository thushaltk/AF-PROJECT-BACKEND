const Attendee = require("../models/attendee");


const addAttendeeDetails = (req, res, next) => {
    console.log(req.body);
    const {fullName, address, email, mobileNo} = req.body;
    new Attendee(fullName,address, email, mobileNo);
    res.json({
        message: "Attendee details recieved successfully"
    })
}

exports.addAttendeeDetails = addAttendeeDetails;
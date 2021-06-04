const { validationResult } = require('express-validator'); //For Validation
const { v4: uuidv4 } = require('uuid'); //Generate unique ID

const HttpError = require('../models/http-error');//Error Model
//Mongoose schemas
const Attendee = require("../models/attendee");

/**
 * Add Attendee Details to MongoDB
 */
const addAttendeeDetails = async (req, res, next) => {
    /**
     * Validate data coming from the req before saving them,
     * to DB.
     */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    /**
     * Creates an object from "Attendee" mongoose schema
     * Assign data from 'req.body' to the object.
    */
    const createAttendee = new Attendee({
        id: uuidv4(),
        fullName: req.body.fullName,
        address: req.body.address,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        isPaid: req.body.isPaid
    })
    /**
     * Saves 'createAttendee' schema to mongodb.
     */
    try {
        await createAttendee.save();
        console.log("Data saved successfully in the DB....:)");
    } catch (err) {
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }

    res.status(201).json({ attendee: createAttendee });
}


/**
 * Get all Attendee Details from MongoDB
 */
const getAllAttendeeDetails = async (req, res, next) => {
    let attendees;
    try{
        attendees = await Attendee.find({}, 'id fullName email address mobileNo isPaid');
        console.log(attendees);
    }catch(err){
        console.log(err);
        throw new HttpError("Fetching attendees failed, try again later", 500);
    }
    res.send(attendees);
}

//Exporting methods
exports.addAttendeeDetails = addAttendeeDetails;
exports.getAllAttendeeDetails = getAllAttendeeDetails;
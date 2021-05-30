const { v4: uuidv4 } = require('uuid');
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

const Reviewer = require("../models/reviewer");
const HttpError = require("../models/http-error");

//Adding new editors - done by admin
const addNewReviewer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid data, check inputs again", 422);
    }

    /**
   * Hashing the password for security using bcryptjs
   */
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(req.body.password, 12);
    } catch (err) {
        const error = new HttpError("Could not create editor, Try again.", 500);
        return next(error);
    }

    const createReviewer = new Reviewer({
        id: uuidv4(),
        fullName: req.body.fullName,
        address: req.body.address,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: hashedPassword
    })
    try{
        await createReviewer.save();
        console.log("Data saved successfully in the DB....:)");
    }catch(err){
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }

    res.status(201).json({ reviewer: createReviewer });

}

//Check Editor login
const checkReviewerLogin = (req, res, next) => {

}

const getAllReviewerDetails = async (req, res, next) => {
    let reviewers;
    try{
        reviewers = await Reviewer.find({}, 'id fullName email address mobileNo password');
        console.log(reviewers);
    }catch(err){
        throw new HttpError("Fetching reviewers failed, try again later", 500);
    }
    res.send(reviewers);
}



exports.addNewReviewer = addNewReviewer;
exports.getAllReviewerDetails = getAllReviewerDetails;
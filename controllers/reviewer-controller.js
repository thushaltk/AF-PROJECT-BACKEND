const { v4: uuidv4 } = require('uuid');
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Reviewer = require("../models/reviewer");
const HttpError = require("../models/http-error");

//Adding new editors - done by admin
const addNewReviewer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    const createReviewer = new Reviewer({
        id: uuidv4(),
        fullName: req.body.fullName,
        address: req.body.address,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: ""
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

const updatePassword = async (req, res, next) => {
    const {email, password} = req.body;
    let existingReviewer;
    try{
        existingReviewer = await Reviewer.findOne({email: email});
    }catch(err){
        const error = new HttpError("Loggin Failed.", 500);
        return next(error);
    }
    if(!existingReviewer){
        const error = new HttpError("Email doesn't exist.", 401);
        return next(error);
    }
    /**
     * Hashing the password for security using bcryptjs
     */
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(err){
        const error = new HttpError("Could not hash password, Try again.", 500);
        return next(error);
    }
    existingReviewer.password = hashedPassword;
    try{
        await existingReviewer.save();
        console.log("Updated reviewer password successfully!")
    }catch(err){
        const error = new HttpError("Cannot update password. Try again...", 500);
        return next(error);
    }
    res.status(201).json({reviewer: existingReviewer});

}

const updateReviewerDetails = async (req, res, next) => {
    const rvid = req.params.id;
    let existingReviewer;
    try{
        existingReviewer = await Reviewer.findOne({id: rvid});
    }catch(err){
        throw new HttpError("Fetching Reviewer failed, try again", 500);
    }
    if(!existingReviewer){
        const error = new HttpError("Reviewer doesn't exist.", 401);
        return next(error);
    }
    existingReviewer.fullName = req.body.fullName;
    existingReviewer.email = req.body.email;
    existingReviewer.mobileNo = req.body.mobileNo;
    try{
        await existingReviewer.save();
        console.log("Updated details...");
    }catch(err){
        const error = new HttpError("Cannot update details. Try again...", 500);
        return next(error);
    }
    res.status(201).json({reviewer: existingReviewer});
}

//Check Editor login
const checkReviewerLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    const {email, password} = req.body;
    let existingReviewer;
    try{
        existingReviewer = await Reviewer.findOne({email: email});
    }catch(err){
        const error = new HttpError("Loggin Failed.", 500);
        return next(error);
    }
    if(!existingReviewer){
        const error = new HttpError("Invalid Credentials.", 401);
        return next(error);
    }
    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password, existingReviewer.password);
    }catch(err){
        const error = new HttpError("Could not login..Invalid Credentials.", 500);
        return next(error);
    }
    if(!isValidPassword){
        const error = new HttpError("Invalid Credentials.", 401);
        return next(error);
    }
    //Generating JWT token
    // let token;
    // try{
    //     token = jwt.sign({reviewerID: existingReviewer.id, email: existingReviewer.email}, 'reviewer_secret_key');
    // }catch(err){
    //     const error = new HttpError("Could not login", 500);
    //     return next(error);
    // }

    res.json({
        reviewerID: existingReviewer.id,
        email: existingReviewer.email,
    });
};

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

const getReviewerById = async (req, res, next) => {
    const rvid = req.params.id;
    let reviewer;
    try{
        reviewer = await Reviewer.findOne({id: rvid});
        console.log(reviewer);
    }catch(err){
        throw new HttpError("Fetching editor failed, try again", 500);
    }
    res.send(reviewer);
}

const deleteReviewerDetails = async(req, res, next) => {
    const rvid = req.params.id;
    try{
        await Reviewer.findOneAndDelete({id: rvid});
        console.log("Deleted Successfully!...");
    }catch(err){
        return next(error);
    }
    res.status(201).json({ message: "Deleted Reviewer..." });
}


exports.addNewReviewer = addNewReviewer;
exports.getAllReviewerDetails = getAllReviewerDetails;
exports.checkReviewerLogin = checkReviewerLogin;
exports.updatePassword = updatePassword;
exports.getReviewerById = getReviewerById;
exports.updateReviewerDetails = updateReviewerDetails;
exports.deleteReviewerDetails = deleteReviewerDetails;
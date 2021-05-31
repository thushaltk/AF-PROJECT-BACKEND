const stripe = require("stripe")("sk_test_51IpE6NGvyYYsIP6DHiFSSQg3bB7Fd44AGHItxN7QgIxT4Jmzk6JNw4dRJIGgr6B3Sp6a17ktp2Mb5uewbIBLke7n00B4DXFwNV");
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator'); //For Validation

const HttpError = require("../models/http-error");
const Researcher = require("../models/researcher");

const stripePayment = (req, res, next) => {
    console.log(req.body.token);
    const {token, amount} = req.body;
    const idempotencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token
    }).then(customer=>{
        stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email
        }, {idempotencyKey})
    }).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        throw new HttpError("Payment Unsuccessful..", 404);
    });
}


const addNewResearcher = async (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    const createResearcher = new Researcher({
        id: uuidv4(),
        fullName: req.body.fullName,
        address: req.body.address,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        isPaid: req.body.isPaid,
        researchPaperURL: req.body.researchPaperURL,
        status: 'Pending'
    })
    try {
        await createResearcher.save();
        console.log("Data saved successfully in the DB....:)");
    } catch (err) {
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }

    res.status(201).json({ researcher: createResearcher });
};

const getAllResearcherData = async (req, res,next) => {
    let researchers;
    try{
        researchers = await Researcher.find({}, 'id fullName email mobileNo researchPaperURL status');
        console.log(researchers);
    }catch(err){
        throw new HttpError("Fetching researchers failed, try again later", 500);
    }
    res.send(researchers);
};

const updateResearcherByID = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError("Invalid inputs, Check again", 422);
    }
    const {status} = req.body;
    const rid = req.params.id;

    let researchersArray;
    try{
        researchersArray = await Researcher.find();
    }catch(err){
        const error = new HttpError("Cannot find requested data....", 500);
        return next(error);
    }

    const singleResearcher = researchersArray.filter(sr => sr.id === rid);
    singleResearcher[0].status = status;

    try{
        await singleResearcher[0].save();
        console.log("Updated successfully...")
    }catch(err){
        const error = new HttpError("Cannot update requested data....", 500);
        return next(error);
    }

    res.status(201).json({ singleResearcher: singleResearcher });

}

exports.stripePayment = stripePayment;
exports.addNewResearcher = addNewResearcher;
exports.getAllResearcherData = getAllResearcherData;
exports.updateResearcherByID = updateResearcherByID;



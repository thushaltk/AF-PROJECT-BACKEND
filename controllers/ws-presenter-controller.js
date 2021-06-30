const { validationResult } = require('express-validator'); //For Validation
const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error'); //Error model
//Mongoose schemas
const WSPresenter = require("../models/workshopPresenter");
const emailController = require("../controllers/mail-controller");

/**
 * Add WSPresenter form data to the MongoDB database.
 */
const addNewWSPresenter = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    const createWSPresenter = new WSPresenter({
        id: uuidv4(),
        fullName: req.body.fullName,
        address: req.body.address,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        wsProposalLink: req.body.wsProposalLink,
        status: 'Pending'
    })
    try {
        await createWSPresenter.save(); //saves data to MongoDB
        console.log("Data saved successfully in the DB....:)");
    } catch (err) {
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }

    res.status(201).json({ wspresenter: createWSPresenter });
}

/**
 * Get all WSPresenter details from MongoDB.
 */
const getAllWSPresenterDetails = async (req, res, next) => {
    let wspresenter;
    try {
        wspresenter = await WSPresenter.find({status: {$ne: "Approved By ADMIN"}});
    } catch (err) {
        throw new HttpError("Cannot fetch WSPresenter details..Try again!", 500);
    }
    res.send(wspresenter);
}

const getAllApprovedDataByReviewer = async (req, res, next) => {
    let approvedWSPresenterData;
    try{
        approvedWSPresenterData = await WSPresenter.find({status: "Approved by Reviewer"});
        if(!approvedWSPresenterData){
            throw new HttpError("Cannot find data", 500);
        }else{
            console.log("Approved WSPresenter = ", approvedWSPresenterData);
        }
    }catch(err){
        const error = new HttpError("Data cannot fetch!", 500);
        return next(error);
    }
    res.send(approvedWSPresenterData);
}

const getAllApprovedDataByAdmin = async (req, res, next) => {
    let approvedWSPresenterData;
    try{
        approvedWSPresenterData = await WSPresenter.find({status: "Approved By ADMIN"});
        if(!approvedWSPresenterData){
            throw new HttpError("Cannot find data", 500);
        }else{
            console.log("Approved WSPresenter = ", approvedWSPresenterData);
        }
    }catch(err){
        const error = new HttpError("Data cannot fetch!", 500);
        return next(error);
    }
    res.send(approvedWSPresenterData);
}

const updateWSPresenterByID = async (req, res, next) => {
    const {status} = req.body;
    const rid = req.params.id;
    let wspresenterArray;
    try{
        wspresenterArray = await WSPresenter.find();
    }catch(err){
        const error = new HttpError("Cannot find requested data....", 500);
        return next(error);
    }
    const singleWSPresenter = wspresenterArray.filter(sr => sr.id === rid);
    singleWSPresenter[0].status = status;
    try{
        await singleWSPresenter[0].save();
        console.log("Updated successfully...")
        if (status === "Approved By ADMIN") {
            emailController.sendMailDetails({
                to: singleWSPresenter[0].email,
                subject: "ICAF 2021 - Your Workshop Proposal APPROVED!!",
                text: "Congatulation!!!... Your research paper has been approved and will be published in ICAF-2021 web page. Please feel free to contact us if you have any inquiries. Thank You and Enjoy the conference."
            }).then(res => {
                if (res) {
                    console.log("Email sent successfully!");
                } else {
                    console.log("Email send failed!!!...");
                }
            });
        }
        
    }catch(err){
        const error = new HttpError("Cannot update requested data....", 500);
        return next(error);
    }
    res.status(201).json({ WSPresenter: singleWSPresenter });
}


const deleteWSPresenter = async (req, res, next) => {
    //Get id passing from frontend from the request
    const wsID = req.params.id;
    
    let wspresentersArray;
    try{
        //Get all Workshop presenter data from DB
        wspresentersArray = await WSPresenter.find();
    }catch(err){
        throw new HttpError("Cannot fetch WSPresenter details..Try again!", 500);
    }


    //Filters the object which has a similar id
    const singleWSPresenter = wspresentersArray.filter(ws=> ws.id === wsID);

    try{
        await singleWSPresenter[0].remove(); //Deletes data from db
        console.log("Deleted successfully...");
        emailController.sendMailDetails({
            to: singleWSPresenter[0].email,
            subject: "ICAF 2021 - Your Workshop Proposal Rejected!!",
            text: "Thank you for your interest in ICAF-2021 conference but unfortunately your research paper has been rejected by our management due to not having a proper format according to our guidelines and your payement of $100 will be refunded as soon as possible. You can republish again and also please feel free to contact us if you have any other inquiries. Thank You!!!"
        }).then(res => {
            if (res) {
                console.log("Email sent successfully!");
            } else {
                console.log("Email send failed!!!...");
            }
        });
    }catch(err){
        const error = new HttpError("Cannot delete requested data....", 500);
        return next(error);
    }
    
    res.status(201).json({ message: "Deleted WSPresenter..." });

}

//Exporting methods.
exports.addNewWSPresenter = addNewWSPresenter;
exports.getAllWSPresenterDetails = getAllWSPresenterDetails;
exports.getAllApprovedDataByReviewer = getAllApprovedDataByReviewer;
exports.deleteWSPresenter = deleteWSPresenter;
exports.updateWSPresenterByID = updateWSPresenterByID;
exports.getAllApprovedDataByAdmin = getAllApprovedDataByAdmin;

const { validationResult } = require('express-validator'); //For Validation

const HttpError = require('../models/http-error'); //Error model
//Mongoose schemas
const Workshop = require("../models/workshop");
const WSPresenter = require("../models/workshopPresenter");

const addNewWorkshop = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    const {conductor} = req.body;
    let wspresenter;
    try{
        wspresenter = await WSPresenter.findOne({fullName: conductor});
    }catch(err){
        return next(err);
    }
    const createWorkshop = new Workshop({
        id: wspresenter.id,
        topic: req.body.topic,
        description: req.body.description,
        conductor: conductor
    })
    try {
        await createWorkshop.save(); //saves data to MongoDB
        console.log("Data saved successfully in the DB....:)");
    } catch (err) {
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }
    res.status(201).json({ workshop: createWorkshop });
}

/**
 * Get all WSPresenter details from MongoDB.
 */
const getAllWorkshopDetails = async (req, res, next) => {
    let workshops;
    try {
        workshops = await Workshop.find({});
    } catch (err) {
        throw new HttpError("Cannot fetch Workshop details..Try again!", 500);
    }
    res.send(workshops);
}



const deleteWorkshop = async (req, res, next) => {
    //Get id passing from frontend from the request
    const wsID = req.params.id;
    
    let workshop;
    try{
        //Get all Workshop presenter data from DB
        workshop = await Workshop.findOne({id: wsID});
    }catch(err){
        throw new HttpError("Cannot fetch Workshop details..Try again!", 500);
    }

    try{
        await workshop.remove(); //Dletes data from db
        console.log("Deleted successfully...")
    }catch(err){
        const error = new HttpError("Cannot delete requested data....", 500);
        return next(error);
    }
    
    res.status(201).json({ message: "Deleted Workshop..." });

}

//Exporting methods.
exports.addNewWorkshop = addNewWorkshop;
exports.getAllWorkshopDetails = getAllWorkshopDetails;
exports.deleteWorkshop = deleteWorkshop;

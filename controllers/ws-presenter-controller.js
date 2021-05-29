const { validationResult } = require('express-validator'); //For Validation
const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

//Mongoose schemas
const WSPresenter = require("../models/workshopPresenter");

const addNewWSPresenter = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    const createWSPresenter = new WSPresenter({
        uid: uuidv4(),
        fullName: req.body.fullName,
        address: req.body.address,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        wsProposalLink: req.body.wsProposalLink
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

exports.addNewWSPresenter = addNewWSPresenter;
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator'); //For Validation
const bcrypt = require('bcryptjs');

const Editor = require("../models/editor");
const HttpError = require("../models/http-error");

//Adding new editors - done by admin
const addNewEditor = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    
    /**
     * Hashing the password for security using bcryptjs
     */
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(req.body.password, 12);
    }catch(err){
        const error = new HttpError("Could not create editor, Try again.", 500);
        return next(error);
    }

    /**
     * creates object from mongoose schema 'Editor'
     */
    const createEditor = new Editor({
        id: uuidv4(),
        fullName: req.body.fullName,
        address: req.body.address,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: hashedPassword,
    })
    try {
        await createEditor.save(); //savea data to db.
        console.log("Data saved successfully in the DB....:)");
    } catch (err) {
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }

    res.status(201).json({ editor: createEditor });
}

//Check Editor login
const checkEditorLogin = (req, res, next) => {
    
}

const getAllEditorDetails = async (req, res, next) => {
    let editors;
    try{
        editors = await Editor.find({}, 'id fullName email address mobileNo password');
        console.log(editors);
    }catch(err){
        throw new HttpError("Fetching editors failed, try again later", 500);
    }
    res.send(editors);
}


exports.addNewEditor = addNewEditor;
exports.getAllEditorDetails = getAllEditorDetails;
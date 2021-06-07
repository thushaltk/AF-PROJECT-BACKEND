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
     * creates object from mongoose schema 'Editor'
     */
    const createEditor = new Editor({
        id: uuidv4(),
        fullName: req.body.fullName,
        address: req.body.address,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: ""
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

const updatePassword = async (req, res, next) => {
    const {email, password} = req.body;
    let existingEditor;
    try{
        existingEditor = await Editor.findOne({email: email});
    }catch(err){
        const error = new HttpError("Loggin Failed.", 500);
        return next(error);
    }
    if(!existingEditor){
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
    existingEditor.password = hashedPassword;
    console.log(existingEditor);
    try{
        await existingEditor.save();
        console.log("Updated editor password successfully!")
    }catch(err){
        const error = new HttpError("Cannot update password. Try again...", 500);
        return next(error);
    }
    res.status(201).json({editor: existingEditor});

}

//Check Editor login
const checkEditorLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    const {email, password} = req.body;
    let existingEditor;
    try{
        existingEditor = await Editor.findOne({email: email});
    }catch(err){
        const error = new HttpError("Loggin Failed.", 500);
        return next(error);
    }
    if(!existingEditor){
        const error = new HttpError("Invalid Credentials.", 401);
        return next(error);
    }
    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password, existingEditor.password);
        console.log(isValidPassword);
    }catch(err){
        const error = new HttpError("Could not login..Invalid Credentials.", 500);
        return next(error);
    }
    if(!isValidPassword){
        const error = new HttpError("Invalid Credentials.", 401);
        return next(error);
    }
    // //Generating JWT token
    // let token;
    // try{
    //     token = jwt.sign({editorID: existingEditor.id, email: existingEditor.email}, 'editor_secret_key');
    // }catch(err){
    //     const error = new HttpError("Could not login", 500);
    //     return next(error);
    // }

    res.json({
        editorID: existingEditor.id,
        email: existingEditor.email
    });
};


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

const getEditorById = async (req, res, next) => {
    const eid = req.params.id;
    console.log(eid);
    let editor;
    try{
        editor = await Editor.findOne({id: eid}, "id fullName email address mobileNo");
        console.log(editor);
    }catch(err){
        throw new HttpError("Fetching editor failed, try again", 500);
    }
    res.send(editor);
}

const updateEditorDetails = async (req, res, next) => {
    const eid = req.params.id;
    let existingEditor;
    try{
        existingEditor = await Editor.findOne({id: eid});
    }catch(err){
        throw new HttpError("Fetching editor failed, try again", 500);
    }
    if(!existingEditor){
        const error = new HttpError("Editor doesn't exist.", 401);
        return next(error);
    }
    existingEditor.fullName = req.body.fullName;
    existingEditor.email = req.body.email;
    existingEditor.mobileNo = req.body.mobileNo;
    try{
        await existingEditor.save();
        console.log("Updated details...");
    }catch(err){
        const error = new HttpError("Cannot update details. Try again...", 500);
        return next(error);
    }
    res.status(201).json({editor: existingEditor});
}

const deleteEditorDetails = async (req, res, next) => {
    const eid = req.params.id;
    try{
        await Editor.findOneAndDelete({id: eid});
        console.log("Deleted Successfully!...");
    }catch(err){
        return next(error);
    }
    res.status(201).json({ message: "Deleted Editor..." });
}


exports.addNewEditor = addNewEditor;
exports.getAllEditorDetails = getAllEditorDetails;
exports.checkEditorLogin = checkEditorLogin;
exports.updatePassword = updatePassword;
exports.getEditorById = getEditorById;
exports.updateEditorDetails = updateEditorDetails;
exports.deleteEditorDetails = deleteEditorDetails;
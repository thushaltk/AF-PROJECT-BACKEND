const Editor = require("../models/editor");

//Adding new editors - done by admin
const addNewEditor = (req, res, next) => {
    const {fullName, address, email, mobileNo, password} = req.body;
    new Editor(fullName, address, email, mobileNo, password);
    res.json({
        message: "Editor details recieved successfully."
    });
}

//Check Editor login
const checkEditorLogin = (req, res, next) => {
    
}


exports.addNewEditor = addNewEditor;
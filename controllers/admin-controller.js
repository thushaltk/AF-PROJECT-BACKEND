const {validationResult} = require('express-validator'); //Used for validating inputs

const HttpError = require("../models/http-error");//Error model

/**
 * Dummy admin credentials.
 */
const ADMIN_LOGIN_DATA = {
    username: "admin",
    password: "admin"
}

/**
 * Checks admin login credentials with dummy credentials
 */
const checkAdminLogin = (req, res, next) => {
    /**
     * Validates inputs before comparison
     */
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError("Invalid data, check input again.", 422);
    }
    /**
     * Extracts username and password from the request body
     * -Object Destructuring-
     */
    const {username, password} = req.body;
    //Compares login credentials with Dummy login credentials
    if(username === ADMIN_LOGIN_DATA.username && password === ADMIN_LOGIN_DATA.password){
        res.status(200).json({
            message: "LOGIN SUCCESSFULL!!"
        });
    }else{
        throw new HttpError("LOGIN CREDENTIALS INVALID.", 404);
    }
}

//Exporting methods
exports.checkAdminLogin = checkAdminLogin;
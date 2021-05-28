const express = require("express");
const { check } = require('express-validator');

const router = express.Router();

//Controller
const adminControllers = require("../controllers/admin-controller");

router.post("/login", 
[
    check('username').not().isEmpty(), 
    check('password').not().isEmpty()
], adminControllers.checkAdminLogin);

module.exports = router;
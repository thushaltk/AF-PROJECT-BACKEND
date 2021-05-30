const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

//Controller import
const reviewerController = require("../controllers/reviewer-controller");


router.post("/add-reviewer", [
    check('fullName').not().isEmpty(),
    check('address').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('mobileNo').isLength({max: 10}),
    check('password').not().isEmpty(),
], reviewerController.addNewReviewer);

router.get("/", reviewerController.getAllReviewerDetails),


module.exports = router;
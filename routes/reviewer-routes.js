const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

//Controller import
const reviewerController = require("../controllers/reviewer-controller");


router.post("/", [
    check('fullName').not().isEmpty(),
    check('address').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('mobileNo').isLength({max: 10}),
], reviewerController.addNewReviewer);

router.get("/:id", reviewerController.getReviewerById);

router.get("/", reviewerController.getAllReviewerDetails),

router.put("/:id", reviewerController.updateReviewerDetails)

router.patch("/", reviewerController.updatePassword);

router.delete("/:id", reviewerController.deleteReviewerDetails)

router.post("/login", [
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty()
], reviewerController.checkReviewerLogin)

module.exports = router;
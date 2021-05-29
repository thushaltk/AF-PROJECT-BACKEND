const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

//Controller import
const researcherController = require("../controllers/researcher-controller");



router.post("/pay", researcherController.stripePayment);

router.post("/add-researcher", [
    check('fullName').not().isEmpty(),
    check('address').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('mobileNo').isLength({max: 10}),
    check('isPaid').not().isEmpty(),
    check('researchPaperURL').not().isEmpty()
],researcherController.addNewResearcher);

router.get("/", researcherController.getAllResearcherData),



module.exports = router;
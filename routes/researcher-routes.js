const express = require('express');

const router = express.Router();

//Controller import
const researcherController = require("../controllers/researcher-controller");

router.post("/pay", researcherController.stripePayment);


module.exports = router;
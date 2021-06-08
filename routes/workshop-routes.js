const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

//Controller import
const workshopController = require("../controllers/workshop-controller");


router.post("/", [
    check('topic').not().isEmpty(),
    check('description').not().isEmpty(),
], workshopController.addNewWorkshop);

router.get("/", workshopController.getAllWorkshopDetails),

router.delete("/:id", workshopController.deleteWorkshop)

module.exports = router;
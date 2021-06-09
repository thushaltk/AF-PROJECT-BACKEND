const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

//Controller import
const wspresenterController = require("../controllers/ws-presenter-controller");


router.post("/add-wspresenter", [
    check('fullName').not().isEmpty(),
    check('address').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('mobileNo').isLength({max: 10}),
    check('wsProposalLink').not().isEmpty()
], wspresenterController.addNewWSPresenter);

router.get("/", wspresenterController.getAllWSPresenterDetails);

router.get("/reviewer-approved", wspresenterController.getAllApprovedDataByReviewer);

router.get("/admin-approved", wspresenterController.getAllApprovedDataByAdmin);

router.patch("/:id", wspresenterController.updateWSPresenterByID);

router.delete("/:id", wspresenterController.deleteWSPresenter);

module.exports = router;
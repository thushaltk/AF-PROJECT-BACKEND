const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

//Controller import
const editorController = require("../controllers/editor-controller");


router.post("/add-editor", [
    check('fullName').not().isEmpty(),
    check('address').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('mobileNo').isLength({min: 10}),
    check('password').not().isEmpty(),
],editorController.addNewEditor);

router.get("/", editorController.getAllEditorDetails),

router.post("/login", [
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty()
], editorController.checkEditorLogin);

module.exports = router;
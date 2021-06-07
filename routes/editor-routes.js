const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

//Controller import
const editorController = require("../controllers/editor-controller");


router.post("/", [
    check('fullName').not().isEmpty(),
    check('address').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('mobileNo').isLength({ min: 10 })
], editorController.addNewEditor);

router.get("/:id", editorController.getEditorById);

router.get("/", editorController.getAllEditorDetails);

router.put("/:id", editorController.updateEditorDetails)

router.patch("/", editorController.updatePassword);

router.delete("/:id", editorController.deleteEditorDetails)

router.post("/login", [
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty()
], editorController.checkEditorLogin);

module.exports = router;
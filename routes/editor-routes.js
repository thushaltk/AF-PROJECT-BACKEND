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

router.get("/inquiries", editorController.getAllInquiries);

router.get("/rs-papers", editorController.getAllRSPapers);

router.put("/rs-papers/:id", editorController.updateRSPaper);

router.get("/rs-papers/:id", editorController.getRSPaperByID);

router.delete("/rs-papers/:id", editorController.deleteRSPaper);

router.get("/ws-proposals", editorController.getAllWSProposals);

router.put("/ws-proposals/:id", editorController.updateWSProposals);

router.get("/ws-proposals/:id", editorController.getWSProposalsByID);

router.delete("/ws-proposals/:id", editorController.deleteWSProposals);

router.get("/conference-topics", editorController.getAllTopics);

router.put("/conference-topics/:id", editorController.updateTopic);

router.patch("/conference-topics/:id", editorController.updateTopicStatus);

router.get("/conference-topics/admin-approved", editorController.getAllApprovedDataByAdmin);

router.get("/conference-topics/:id", editorController.getTopicByID);

router.delete("/conference-topics/:id", editorController.deleteTopic);



router.get("/:id", editorController.getEditorById);

router.get("/", editorController.getAllEditorDetails);

router.put("/:id", editorController.updateEditorDetails)

router.patch("/", editorController.updatePassword);

router.delete("/:id", editorController.deleteEditorDetails)

router.post("/login", [
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty()
], editorController.checkEditorLogin);

router.post("/publish-paper", editorController.addRSPaper);

router.post("/publish-proposal", editorController.addWSProposal);

router.post("/conference-topics", editorController.addTopics);

router.post("/inquiries", editorController.addInquiries);

module.exports = router;
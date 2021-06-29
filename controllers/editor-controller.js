const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator'); //For Validation
const bcrypt = require('bcryptjs');

const Editor = require("../models/editor");
const Paper = require("../models/paper");
const WSProposal = require("../models/wsproposal");
const Topic = require("../models/topics");
const Inquiry = require("../models/inquiries");
const HttpError = require("../models/http-error");

//Adding new editors - done by admin
const addNewEditor = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    /**
     * creates object from mongoose schema 'Editor'
     */
    const createEditor = new Editor({
        id: uuidv4(),
        fullName: req.body.fullName,
        address: req.body.address,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: ""
    })
    try {
        await createEditor.save(); //savea data to db.
        console.log("Data saved successfully in the DB....:)");
    } catch (err) {
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }

    res.status(201).json({ editor: createEditor });
}

const updatePassword = async (req, res, next) => {
    const { email, password } = req.body;
    let existingEditor;
    try {
        existingEditor = await Editor.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("Loggin Failed.", 500);
        return next(error);
    }
    if (!existingEditor) {
        const error = new HttpError("Email doesn't exist.", 401);
        return next(error);
    }
    /**
     * Hashing the password for security using bcryptjs
     */
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError("Could not hash password, Try again.", 500);
        return next(error);
    }
    existingEditor.password = hashedPassword;
    console.log(existingEditor);
    try {
        await existingEditor.save();
        console.log("Updated editor password successfully!")
    } catch (err) {
        const error = new HttpError("Cannot update password. Try again...", 500);
        return next(error);
    }
    res.status(201).json({ editor: existingEditor });

}

//Check Editor login
const checkEditorLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError("Invalid data, check inputs again", 422);
    }
    const { email, password } = req.body;
    let existingEditor;
    try {
        existingEditor = await Editor.findOne({ email: email });
    } catch (err) {
        const error = new HttpError("Loggin Failed.", 500);
        return next(error);
    }
    if (!existingEditor) {
        const error = new HttpError("Invalid Credentials.", 401);
        return next(error);
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingEditor.password);
        console.log(isValidPassword);
    } catch (err) {
        const error = new HttpError("Could not login..Invalid Credentials.", 500);
        return next(error);
    }
    if (!isValidPassword) {
        const error = new HttpError("Invalid Credentials.", 401);
        return next(error);
    }
    // //Generating JWT token
    // let token;
    // try{
    //     token = jwt.sign({editorID: existingEditor.id, email: existingEditor.email}, 'editor_secret_key');
    // }catch(err){
    //     const error = new HttpError("Could not login", 500);
    //     return next(error);
    // }

    res.json({
        editorID: existingEditor.id,
        email: existingEditor.email
    });
};


const getAllEditorDetails = async (req, res, next) => {
    let editors;
    try {
        editors = await Editor.find({}, 'id fullName email address mobileNo password');
        console.log(editors);
    } catch (err) {
        throw new HttpError("Fetching editors failed, try again later", 500);
    }
    res.send(editors);
}

const getEditorById = async (req, res, next) => {
    const eid = req.params.id;
    console.log(eid);
    let editor;
    try {
        editor = await Editor.findOne({ id: eid }, "id fullName email address mobileNo");
        console.log(editor);
    } catch (err) {
        throw new HttpError("Fetching editor failed, try again", 500);
    }
    res.send(editor);
}

const updateEditorDetails = async (req, res, next) => {
    const eid = req.params.id;
    let existingEditor;
    try {
        existingEditor = await Editor.findOne({ id: eid });
    } catch (err) {
        throw new HttpError("Fetching editor failed, try again", 500);
    }
    if (!existingEditor) {
        const error = new HttpError("Editor doesn't exist.", 401);
        return next(error);
    }
    existingEditor.fullName = req.body.fullName;
    existingEditor.email = req.body.email;
    existingEditor.mobileNo = req.body.mobileNo;
    try {
        await existingEditor.save();
        console.log("Updated details...");
    } catch (err) {
        const error = new HttpError("Cannot update details. Try again...", 500);
        return next(error);
    }
    res.status(201).json({ editor: existingEditor });
}

const deleteEditorDetails = async (req, res, next) => {
    const eid = req.params.id;
    try {
        await Editor.findOneAndDelete({ id: eid });
        console.log("Deleted Successfully!...");
    } catch (err) {
        return next(error);
    }
    res.status(201).json({ message: "Deleted Editor..." });
}

const addRSPaper = async (req, res, next) => {
    const createPaper = new Paper({
        id: uuidv4(),
        researchPaperTitle: req.body.researchPaperTitle,
        coverImgURL: req.body.coverImgURL,
        authorName: req.body.authorName,
        authorEmail: req.body.authorEmail,
        researchPaperURL: req.body.researchPaperURL
    });
    try {
        await createPaper.save(); //saves data to db.
        console.log("Data saved successfully in the DB....:)");
    } catch (err) {
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }

    res.status(201).json({ paper: createPaper });

}

const getAllRSPapers = async (req, res, next) => {
    let papers;
    try {
        papers = await Paper.find();
        console.log(papers);
    } catch (err) {
        throw new HttpError("Fetching papers failed, try again later", 500);
    }
    res.send(papers);
}

const getRSPaperByID = async (req, res, next) => {
    const rsid = req.params.id;
    let rspaper;
    try {
        rspaper = await Paper.findOne({ id: rsid });
    } catch (err) {
        throw new HttpError("Fetching rspaper failed, try again", 500);
    }
    res.send(rspaper);
}

const updateRSPaper = async (req, res, next) => {
    const rsid = req.params.id;
    let existingRSPaper;
    try {
        existingRSPaper = await Paper.findOne({ id: rsid });
    } catch (err) {
        throw new HttpError("Fetching RSpaper failed, try again", 500);
    }
    if (!existingRSPaper) {
        const error = new HttpError("RSPaper doesn't exist.", 401);
        return next(error);
    }
    existingRSPaper.researchPaperTitle = req.body.researchPaperTitle;
    existingRSPaper.coverImgURL = req.body.coverImgURL;
    existingRSPaper.authorName = req.body.authorName;
    existingRSPaper.authorEmail = req.body.authorEmail;
    existingRSPaper.researchPaperURL = req.body.researchPaperURL;

    try {
        await existingRSPaper.save();
        console.log("Updated details...");
    } catch (err) {
        const error = new HttpError("Cannot update details. Try again...", 500);
        return next(error);
    }
    res.status(201).json({ rspaper: existingRSPaper });
}

const deleteRSPaper = async (req, res, next) => {
    const rsid = req.params.id;
    try {
        await Paper.findOneAndDelete({ id: rsid });
        console.log("Deleted Successfully!...");
    } catch (err) {
        return next(error);
    }
    res.status(201).json({ message: "Deleted RS Paper..." });
}

const addWSProposal = async (req, res, next) => {
    const createWSProposal = new WSProposal({
        id: uuidv4(),
        wsProposalTitle: req.body.wsProposalTitle,
        coverImgURL: req.body.coverImgURL,
        authorName: req.body.authorName,
        authorEmail: req.body.authorEmail,
        wsProposalLink: req.body.wsProposalLink
    });
    try {
        await createWSProposal.save(); //saves data to db.
        console.log("Data saved successfully in the DB....:)");
    } catch (err) {
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }

    res.status(201).json({ wsproposal: createWSProposal });

}

const getAllWSProposals = async (req, res, next) => {
    let wsproposals;
    try {
        wsproposals = await WSProposal.find();
        console.log(wsproposals);
    } catch (err) {
        throw new HttpError("Fetching papers failed, try again later", 500);
    }
    res.send(wsproposals);
}

const getWSProposalsByID = async (req, res, next) => {
    const wsid = req.params.id;
    let wsproposal;
    try {
        wsproposal = await WSProposal.findOne({ id: wsid });
    } catch (err) {
        throw new HttpError("Fetching wsproposal failed, try again", 500);
    }
    res.send(wsproposal);
}

const updateWSProposals = async (req, res, next) => {
    const wsid = req.params.id;
    let existingWSProposal;
    try {
        existingWSProposal = await WSProposal.findOne({ id: wsid });
    } catch (err) {
        throw new HttpError("Fetching WSProposal failed, try again", 500);
    }
    if (!existingWSProposal) {
        const error = new HttpError("WSProposal doesn't exist.", 401);
        return next(error);
    }
    existingWSProposal.wsProposalTitle = req.body.wsProposalTitle;
    existingWSProposal.coverImgURL = req.body.coverImgURL;
    existingWSProposal.authorName = req.body.authorName;
    existingWSProposal.authorEmail = req.body.authorEmail;
    existingWSProposal.wsProposalLink = req.body.wsProposalLink;

    try {
        await existingWSProposal.save();
        console.log("Updated details...");
    } catch (err) {
        const error = new HttpError("Cannot update details. Try again...", 500);
        return next(error);
    }
    res.status(201).json({ wsproposal: existingWSProposal });
}

const deleteWSProposals = async (req, res, next) => {
    const wsid = req.params.id;
    try {
        await WSProposal.findOneAndDelete({ id: wsid });
        console.log("Deleted Successfully!...");
    } catch (err) {
        return next(error);
    }
    res.status(201).json({ message: "Deleted WS Proposal..." });
}

const addTopics = async (req, res, next) => {
    const createTopic = new Topic({
        id: uuidv4(),
        topicTitle: req.body.topicTitle,
        description: req.body.description,
        coverImgURL: req.body.coverImgURL,
        status: "Pending"
    });
    try {
        await createTopic.save(); //saves data to db.
        console.log("Data saved successfully in the DB....:)");
    } catch (err) {
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }

    res.status(201).json({ topic: createTopic });
}

const getAllTopics = async (req, res, next) => {
    let topics;
    try {
        topics = await Topic.find();
        console.log(topics);
    } catch (err) {
        throw new HttpError("Fetching topics failed, try again later", 500);
    }
    res.send(topics);
}

const getTopicByID = async (req, res, next) => {
    const topicid = req.params.id;
    let topic;
    try {
        topic = await Topic.findOne({ id: topicid });
    } catch (err) {
        throw new HttpError("Fetching topic failed, try again", 500);
    }
    res.send(topic);
}

const updateTopic = async (req, res, next) => {
    const topicid = req.params.id;
    let existingTopic;
    try {
        existingTopic = await Topic.findOne({ id: topicid });
    } catch (err) {
        throw new HttpError("Fetching topic failed, try again", 500);
    }
    if (!existingTopic) {
        const error = new HttpError("Topic doesn't exist.", 401);
        return next(error);
    }
    existingTopic.topicTitle = req.body.topicTitle;
    existingTopic.description = req.body.description;
    existingTopic.coverImgURL = req.body.coverImgURL;
    existingTopic.status = "Pending"; 
    try {
        await existingTopic.save();
        console.log("Updated details...");
    } catch (err) {
        const error = new HttpError("Cannot update details. Try again...", 500);
        return next(error);
    }
    res.status(201).json({ topic: existingTopic });
}

const updateTopicStatus = async (req, res, next) => {
    const { status } = req.body;
    const topicid = req.params.id;

    let topicsArray;
    try {
        topicsArray = await Topic.find();
    } catch (err) {
        const error = new HttpError("Cannot find requested data....", 500);
        return next(error);
    }

    const singleTopic = topicsArray.filter(tp => tp.id === topicid);
    singleTopic[0].status = status;

    try {
        await singleTopic[0].save();
        console.log("Updated successfully...")
    } catch (err) {
        const error = new HttpError("Cannot update requested data....", 500);
        return next(error);
    }

    res.status(201).json({ singleTopic: singleTopic });

}

const deleteTopic = async (req, res, next) => {
    const topicid = req.params.id;
    try {
        await Topic.findOneAndDelete({ id: topicid });
        console.log("Deleted Topic Successfully!...");
    } catch (err) {
        return next(error);
    }
    res.status(201).json({ message: "Deleted Topic..." });
}

const getAllApprovedDataByAdmin = async (req, res, next) => {
    let approvedTopicData;
    try {
        approvedTopicData = await Topic.find({ status: "Approved By ADMIN" });
        if (!approvedTopicData) {
            throw new HttpError("Cannot find data", 500);
        } else {
            console.log("Approved Topic = ", approvedTopicData);
        }
    } catch (err) {
        const error = new HttpError("Data cannot fetch!", 500);
        return next(error);
    }
    res.send(approvedTopicData);
}

const addInquiries = async (req, res, next) => {
    const createInquiry = new Inquiry({
        id: uuidv4(),
        fullName: req.body.fullName,
        email: req.body.email,
        message: req.body.message,
    });
    try {
        await createInquiry.save(); //saves data to db.
        console.log("Data saved successfully in the DB....:)");
    } catch (err) {
        const error = new HttpError("Cannot add data to database :(....", 500);
        return next(error);
    }

    res.status(201).json({ unquiry: createInquiry });
}

const getAllInquiries = async (req, res, next) => {
    let inquiries;
    try {
        inquiries = await Inquiry.find();
        console.log(inquiries);
    } catch (err) {
        throw new HttpError("Fetching inquiries failed, try again later", 500);
    }
    res.send(inquiries);
}


exports.addNewEditor = addNewEditor;
exports.getAllEditorDetails = getAllEditorDetails;
exports.checkEditorLogin = checkEditorLogin;
exports.updatePassword = updatePassword;
exports.getEditorById = getEditorById;
exports.updateEditorDetails = updateEditorDetails;
exports.deleteEditorDetails = deleteEditorDetails;
exports.addRSPaper = addRSPaper;
exports.getAllRSPapers = getAllRSPapers;
exports.getRSPaperByID = getRSPaperByID;
exports.updateRSPaper = updateRSPaper;
exports.deleteRSPaper = deleteRSPaper;
exports.addWSProposal = addWSProposal;
exports.getAllWSProposals = getAllWSProposals;
exports.getWSProposalsByID = getWSProposalsByID;
exports.updateWSProposals = updateWSProposals;
exports.deleteWSProposals = deleteWSProposals;
exports.addTopics = addTopics;
exports.getAllTopics = getAllTopics;
exports.getTopicByID = getTopicByID;
exports.updateTopic = updateTopic;
exports.deleteTopic = deleteTopic;
exports.updateTopicStatus = updateTopicStatus;
exports.getAllApprovedDataByAdmin = getAllApprovedDataByAdmin;
exports.addInquiries = addInquiries;
exports.getAllInquiries = getAllInquiries;

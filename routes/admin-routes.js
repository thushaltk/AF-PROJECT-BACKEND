const express = require("express");

const router = express.Router();

//Controller
const adminControllers = require("../controllers/admin-controller");

router.post("/login", adminControllers.checkAdminLogin);

module.exports = router;
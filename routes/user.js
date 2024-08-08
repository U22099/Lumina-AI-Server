const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/", userController.getData);
router.delete("/", userController.deleteUser);

module.exports = router;

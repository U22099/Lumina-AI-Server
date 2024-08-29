const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/", userController.getData);
router.post("/update", userController.updateImage);
router.post("/delete", userController.deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const musicApiController = require("../../controller/api/musicApiController");

router.post("/", musicApiController.addMusic);
router.get("/", musicApiController.getMusics);
router.delete("/", musicApiController.deleteMusicById);
router.post("/data", musicApiController.getMusicById);
router.get("/top", musicApiController.getTopSixMusics);
router.get("/recent", musicApiController.getRecentlyUploaded);

module.exports = router;

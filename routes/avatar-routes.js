const {
  uploadAvatar,
  deleteAvatar,
  getAvatar,
  updateAvatar,
} = require("../controllers/avatarCTRL");
//const express = require("express");
// const router = expresss.Router()
const router = require("express").Router();

router.route("/").post(uploadAvatar);
router.route("/:id").get(getAvatar).patch(updateAvatar).delete(deleteAvatar);

module.exports = router;

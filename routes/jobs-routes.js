const {
  createJobs,
  getSingleJob,
  updateJobs,
  getEmployerPosts,
  deleteJobs,
  getAllJobs,
} = require("../controllers/jobsCTRL");
const { applyForJob, getApplicantsForJob } = require("../controllers/applicationCTRL")
//const express = require("express");
// const router = expresss.Router()
const router = require("express").Router();

router.route("/myJobs").get(getEmployerPosts);
router.route("/").get(getAllJobs).post(createJobs);
router.route("/:id").get(getSingleJob).patch(updateJobs).delete(deleteJobs);
router.route("/:id/apply").post(applyForJob);
router.route("/myJobs/:id/applicants").get(getApplicantsForJob);
module.exports = router;

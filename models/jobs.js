const mongoose = require("mongoose");

// Create a Job model
const JobsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    description: {
      type: String,
      // required: true
    },
    salary: { type: Number },
    jobStatus: {
      type: String,
      default: "Open",
      enum: {
        values: ["Open", "Closed", "Expired"],
      },
    },
    jobType: {
      type: String,
      default: "Full-time",
      enum: {
        values: ["Full-time", "Freelance", "Part-time", "negotiable"],
      },
    },
    MinQualification: { type: String },
    benefits: { type: String },
    requiredSkills: { type: [String] },
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    validUntil: {
      type: Date,
      //required: true,
      validate: {
        validator: function (params) {
          const validDate = new Date();
          validDate.setDate(validDate.getDate() + 3600);
          return params >= new Date() && params <= validDate;
        },
        message: "Please choose a valid date",
      },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    applicants: [{ type: mongoose.Types.ObjectId, ref: "JobSeeker" }],
  },
  { timestamps: true }
);

JobsSchema.pre("save", function (next) {
  if (this.validUntil <= new Date()) {
    this.jobStatus = "Expired";
  }
  next();
});

JobsSchema.virtual("recommended").get(function () {
  // Check if the employer is verified
  if (this.employer && this.employer.isVerified) {
    return true;
  }
  return false;
});

/* 
const recommendedJobs = await Job.find()
  .sort({ recommended: -1 })
  .exec();
 */

module.exports = mongoose.model("Jobs", JobsSchema);

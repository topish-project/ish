const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

// Create an Employer model
const employerSchema = new Schema({
  fullName: { type: String, default: "" },
  companyName: { type: String, default: "" },
  aboutcompany: { type: String, default: "" },
  industry: { type: String, default: "" },
  contactNumber: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  location: { type: String, default: "" },
  isVerified: {
    type: Boolean,
    default: false,
  },
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Jobs" }],
});

// Create a JobSeeker model
const jobSeekerSchema = new Schema({
  fullName: { type: String, default: "" },
  gender: {
    type: String,
    required: false,
    default: "Choose",
    enum: {
      values: ["Male", "Female", "Choose"],
    },
  },
  birthday: {
    type: String,
  },
  skills: { type: Array, default: [] },
  isVerified: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    default: "",
    required: false,
  },
  desiredSalary: { type: Number },
  cv: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        // Add validation rules for file upload here
        // For example, check if the file is a PDF or DOCX file
        const allowedFileTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return allowedFileTypes.includes(v.mimetype);
      },
      message: (props) => `${props.value} is not a valid file type!`,
    },
  },
  expectedSalary: { type: String, required: false, default: "" },
  jobtitle: { type: String, required: false, default: "" },
  experience: { type: String, required: false, default: "0" },
  employmentType: { type: String, required: false, default: "full-time" },
});

// Create a User model
const UsersSchema = new Schema({
  phoneNumber: { type: String },
  email: { type: String },
  phoneConfirmed: { type: Boolean, default: false },
  emailConfirmed: { type: Boolean, default: false },
  accountVisibility: { type: String, default: "public" },
  friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  lastSeen: { type: Date, default: Date.now },
  role: {
    type: String,
    required: false,
    enum: ["JobSeeker", "Employer"],
  },
  password: { type: String, required: true, minlength: 8 },
  jobSeeker: {
    type: jobSeekerSchema,
    required: function () {
      return this.role === "JobSeeker";
    },
  },
  employer: {
    type: employerSchema,
    required: function () {
      return this.role === "Employer";
    },
  },
  resumeId: {
    type: Schema.Types.ObjectId,
    ref: "Resume",
    required: false,
  },
  tokens: { type: [Object] },
  coins: { type: Number, default: 50 },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  avatar: { type: String, default: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg" },
  createdAt: { type: Date, default: Date.now },
});

// it generates passwords into hash
UsersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password function
UsersSchema.methods.comparePassword = async function (candidatePasssword) {
  const isMatch = await bcrypt.compare(candidatePasssword, this.password);
  return isMatch;
};

const Users = mongoose.model("Users", UsersSchema);
const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);
const Employer = mongoose.model("Employer", employerSchema);
module.exports = { Users, JobSeeker, Employer };



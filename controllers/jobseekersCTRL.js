const { Users } = require("../models/users");
const { handleResponse } = require("../utils/handleResponse");
const Resume = require('../models/resumeSchema'); // Ensure this path points to your Resume model

//property for selecting employee info to get back
const property =
    " role jobSeeker.fullName jobSeeker.skills jobSeeker.gender jobSeeker.age jobSeeker.education jobSeeker.experience jobSeeker.desiredSalary";
// Function to map experience text to a numerical range
function getExperienceRange(experienceText) {
    const mappings = {
        'No experience': { min: null, max: 0 },
        '0-1 year': { min: 0, max: 1 },
        '1-2 year': { min: 1, max: 2 },
        '2-5 year': { min: 2, max: 5 },
        '6-10 year': { min: 6, max: 10 },
        'more Than 10 years': { min: 10, max: null }
    };
    return mappings[experienceText] || null;
}

class JobSeekerCTRL {
    // it shows all employees
    async getAllJobSeekers(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const resultUsers = await Users.find({
                jobSeeker: { $exists: true },
            });

            return handleResponse(res, 200, 'success', 'Job seekers retrieved successfully', [...resultUsers], resultUsers.length);
        } catch (error) {
            console.error("Error in getAllJobSeekers function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }
    async getJobSeekersBySkills(req, res) {
        try {
            console.log(req.query)
            const { skills } = req.query;

            if (skills === undefined || skills === "") {
                return handleResponse(res, 400, 'error', 'Please enter skills!', {}, 0);
            }

            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const resultUsers = await Users.find({
                $and: [
                    { jobSeeker: { $exists: true } }, // only search for users who have the jobSeeker field
                    {
                        $or: [
                            { "jobSeeker.skills": { $regex: skills, $options: "i" } }, // search by skills
                        ],
                    },
                ],
            });

            return handleResponse(res, 200, 'success', 'Job seekers retrieved successfully', [...resultUsers], resultUsers.length);
        } catch (error) {
            console.error("Error in getJobSeekersBySkills function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }
    async getJobSeekersByName(req, res) {
        let { fullname } = req.query;

        if (!fullname) {
            return handleResponse(res, 400, 'error', 'Please enter full name!', {}, 0);
        }

        if (!req.user) {
            return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
        }

        // Normalize the fullName by removing spaces and converting to lowercase
        fullname = fullname.replace(/\s+/g, '').toLowerCase();

        try {
            // Create a case-insensitive regex pattern to match the normalized fullName
            // The \s* between each character allows for any number of spaces to appear between letters
            const pattern = fullname.split('').join('\\s*');
            const regex = new RegExp(pattern, 'i');

            const resultUsers = await Users.find({
                $and: [
                    { jobSeeker: { $exists: true } }, // Only search for users who have the jobSeeker field
                    { "jobSeeker.fullName": { $regex: regex } }, // Search by fullName in jobSeeker subdocument
                ],
            });

            return handleResponse(res, 200, 'success', 'Job seekers retrieved successfully', [...resultUsers], resultUsers.length);
        } catch (error) {
            console.error("Error in getJobSeekersByName function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }
    async getJobSeekersByParams(req, res) {
        let { skills, location, salary, worktype, employmentType, experience, education } = req.query;

        if (!req.user) {
            return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
        }

        if (!req.user.employer) {
            return handleResponse(res, 401, 'error', 'employer only', {}, 0);
        }

        try {
            let resumeQueryObject = {}; // Query object for the resume
            let userQueryObject = {}; // Query object for the user

            // Build query for Resume
            if (location) userQueryObject['jobSeeker.location'] = location;
            if (education) resumeQueryObject.education = { $in: [education] }; // Assuming education is an array in the resume
            if (skills) userQueryObject["jobSeeker.skills"] = { $in: [skills] }; // Assuming education is an array in the resume
            // ... handle other resume-specific query parameters ...

            // Build query for Users
            if (worktype) userQueryObject.worktype = worktype;
            if (employmentType) userQueryObject['jobSeeker.employmentType'] = employmentType;
            // ... handle other user-specific query parameters ...

            // Handling salary and experience would depend on where they are stored (User or Resume)

            // First, find users that match the userQueryObject
            const matchedUsers = await Users.find(userQueryObject).populate({
                path: 'resumeId',
                match: resumeQueryObject
            });

            // Filter out users whose resumes don't match the resumeQueryObject
            const resultUsers = matchedUsers.filter(user => user.resumeId && Object.keys(user.resumeId).length > 0);

            return handleResponse(res, 200, 'success', 'Job seekers retrieved successfully', ...resultUsers, resultUsers.length);
        } catch (error) {
            console.error("Error in getJobSeekersByParams function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }
}


module.exports = new JobSeekerCTRL();


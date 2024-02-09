const { Users } = require("../models/users");
const { handleResponse } = require("../utils/handleResponse");

//property for selecting employer info to get back
const property =
    " role employer.fullName employer.companyName employer.industry employer.companySize employer.location employer.jobs ";

class EmployersCTRL {
    // it shows all employers
    async getAllEmployers(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const searchedUsers = await Users.find({
                role: ["Employer", "JobsAndTalents"],
            });

            return handleResponse(res, 200, 'success', 'Employers retrieved successfully', ...searchedUsers, searchedUsers.length);
        } catch (error) {
            console.error("Error in getAllEmployers function:", error);
            return handleResponse(res, error.status || 500, 'error', error.message || 'Something went wrong', {}, 0);
        }
    }

    // search by their company
    async searchEmployers(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }
            const { companyName } = req.query;
            if (!companyName) {
                return handleResponse(res, 400, 'error', 'Company name is required!', {}, 0);
            }
            // Remove spaces from the search query and create a regex pattern to match the company name in a case-insensitive manner
            // This pattern will allow any characters to appear between the characters in companyName
            const sanitizedQuery = companyName.replace(/\s+/g, '');
            const regexPattern = sanitizedQuery.split('').join('.*');
            const regex = new RegExp(regexPattern, 'i');

            const searchedUsers = await Users.find({
                "employer.companyName": { $regex: regex }
            });

            const count = searchedUsers.length;
            if (count === 0) {
                return handleResponse(res, 200, 'success', 'No employers found with the provided company name', {}, 0);
            } else {
                return handleResponse(res, 200, 'success', 'Employers retrieved successfully', ...searchedUsers, count);
            }
        } catch (error) {
            console.error("Error in searchEmployers function:", error);
            return handleResponse(res, error.status || 500, 'error', error.message || 'Something went wrong', {}, 0);
        }
    }





}

module.exports = new EmployersCTRL();

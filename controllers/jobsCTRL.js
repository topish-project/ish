const Jobs = require("../models/jobs");
const { Users } = require("../models/users");
const { handleResponse } = require("../utils/handleResponse");

class JobsCTRL {
    async createJobs(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const coins = req.user.coins;
            if (req.user.role !== "Employer") {
                return handleResponse(res, 403, 'error', 'You are not allowed!', {}, 0);
            }

            if (coins == null) {
                return handleResponse(res, 400, 'error', 'There are some problems with your coins. Please contact support.', {}, 0);
            }

            if (coins < 5) {
                return handleResponse(res, 400, 'error', 'Not enough coins.', {}, 0);
            }

            const userId = req.user.id;
            const user = await Users.findOne({ _id: userId });
            if (!user || !user.employer) {
                return handleResponse(res, 400, 'error', 'Employer details not found.', {}, 0);
            }
            req.body.createdBy = user.employer._id;
            const job = await Jobs.create(req.body);

            await Users.findByIdAndUpdate(userId, { $inc: { coins: -5 } });

            return handleResponse(res, 201, 'success', 'Job created successfully', { job }, 1);
        } catch (error) {
            console.error("Error in createJobs function:", error);
            return handleResponse(res, 500, 'error', 'An error occurred while creating the job.', {}, 0);
        }
    }

    async deleteJobs(req, res, next) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            } else if (req.user.role !== "Employer") {
                return handleResponse(res, 401, 'error', 'You are not allowed!', {}, 0);
            }

            const {
                params: { id: jobID },
            } = req;

            const deleteJob = await Jobs.findOneAndRemove({
                _id: jobID,
                createdBy: req.user.employer._id,
            });

            if (!deleteJob) {
                return handleResponse(res, 404, 'error', `Job with id: ${jobID} not found`, {}, 0);
            }

            return handleResponse(res, 200, 'success', 'Job deleted successfully', { deleteJob }, 1);
        } catch (error) {
            console.error("Error in deleteJobs function:", error);
            return handleResponse(res, 500, 'error', 'An error occurred while deleting the job.', {}, 0);
        }
    }

    async getAllJobs(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const { recommended, salary, title, sort, field, numericFilters } = req.query;
            const queryObject = {};

            if (recommended) {
                queryObject.recommended = recommended === "true" ? true : false;
            }
            if (salary) {
                queryObject.salary = salary;
            }
            if (title) {
                queryObject.title = { $regex: title, $options: "i" };
            }

            let resultJobs = Jobs.find(queryObject);

            // Sort function
            if (sort) {
                const sortList = sort.split(",").join(" ");
                resultJobs = resultJobs.sort(sortList);
            } else {
                resultJobs = resultJobs.sort("-createdAt");
            }

            // Field for choosing existing parameters and it shows those parameters
            if (field) {
                const fieldList = field.split(",").join(" ");
                resultJobs = resultJobs.select(fieldList);
            } else {
                resultJobs = resultJobs.select("title location createdBy");
            }

            // I didn't write about numericFilters option
            const searchedJob = await resultJobs;

            return handleResponse(res, 200, 'success', 'Jobs retrieved successfully', { searchedJob, totalJobs: searchedJob.length }, searchedJob.length);
        } catch (error) {
            console.error("Error in getAllJobs function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }

    async getEmployerPosts(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            } else if (req.user.role !== "Employer") {
                return handleResponse(res, 401, 'error', 'You are not allowed!', {}, 0);
            }

            const allJobs = await Jobs.find({ createdBy: req.user.employer._id }).sort("-createdAt");

            return handleResponse(res, 200, 'success', 'Employer posts retrieved successfully', { allJobs, totalJobs: allJobs.length }, allJobs.length);
        } catch (error) {
            console.error("Error in getEmployerPosts function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }

    async getSingleJob(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const {
                params: { id: jobID },
            } = req; // request gives the ID of the item

            const singleJob = await Jobs.findOne({ _id: jobID });

            if (!singleJob) {
                return handleResponse(res, 404, 'error', `Job not found with ID: ${jobID}`, {}, 0);
            }

            return handleResponse(res, 200, 'success', 'Job retrieved successfully', { singleJob }, 1);
        } catch (error) {
            console.error("Error in getSingleJob function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }

    async updateJobs(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            } else if (req.user.role !== "Employer") {
                return handleResponse(res, 401, 'error', 'You are not allowed!', {}, 0);
            }

            const {
                params: { id: jobID },
            } = req;

            const updatedJob = await Jobs.findOneAndUpdate(
                { _id: jobID, createdBy: req.user.employer._id },
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!updatedJob) {
                return handleResponse(res, 404, 'error', `Job not found with ID: ${jobID}`, {}, 0);
            }

            return handleResponse(res, 200, 'success', 'Job updated successfully', { updatedJob }, 1);
        } catch (error) {
            console.error("Error in updateJobs function:", error);
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }

}

module.exports = new JobsCTRL();
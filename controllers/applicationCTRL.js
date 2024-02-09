const jobs = require("../models/jobs");
const { Users } = require("../models/users");
const { handleResponse } = require("../utils/handleResponse");


class ApplicationCTRL {
    async applyForJob(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }
            const {
                params: { id: jobID },
            } = req;
            const userID = req.user.id;

            const user = await Users.findById(userID);

            // Check if the user or user's jobSeeker data exists
            if (!user || !user.jobSeeker) {
                return handleResponse(res, 400, 'error', 'Only job seekers can apply for jobs', {}, 0);
            }

            const jobSeekerID = user.jobSeeker._id;

            const job = await jobs.findOne({ _id: jobID });

            // Check if the job exists
            if (!job) {
                return handleResponse(res, 404, 'error', 'Job not found', {}, 0);
            }

            // Check if the job seeker is trying to apply to a job they have already applied for
            if (job.applicants && job.applicants.includes(jobSeekerID)) {
                return handleResponse(res, 400, 'error', 'You have already applied for this job', {}, 0);
            }

            // Add job seeker's ID to the applicants array
            job.applicants.push(jobSeekerID);
            await job.save();

            return handleResponse(res, 201, 'success', 'Job application submitted successfully', {}, 0);
        } catch (error) {
            return handleResponse(res, 500, 'error', 'Internal Server Error', {}, 0);
        }
    }
    async getApplicantsForJob(req, res, next) {
        if (!req.user) {
            return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
        }

        const jobID = req.params.id;
        if (!jobID) {
            return handleResponse(res, 400, 'error', 'Job ID must be provided', {}, 0);
        }

        try {
            const job = await jobs.findById(jobID);
            if (!job) {
                return handleResponse(res, 404, 'error', 'Job not found', {}, 0);
            }

            const applicantsData = [];
            for (let i = 0; i < job.applicants.length; i++) {
                const applicant = await Users.findOne({ "jobSeeker._id": job.applicants[i] }).populate('jobSeeker');
                if (applicant && applicant.jobSeeker) {
                    // Construct your applicant data here including the application status
                    applicantsData.push({
                        id: applicant._id,
                        name: applicant.name, // or applicant.jobSeeker.name if the name is in the jobSeeker sub-document
                        email: applicant.email, // or applicant.jobSeeker.email
                        status: applicant.jobSeeker.applicationStatus // assuming applicationStatus is stored in jobSeeker sub-document
                        // add other fields you might need
                    });
                }
            }

            return handleResponse(res, 200, 'success', 'Applicants retrieved successfully', { applicants: applicantsData }, applicantsData.length);
        } catch (error) {
            console.error(error);
            return handleResponse(res, 500, 'error', 'An error occurred while fetching the applicants.', {}, 0);
        }
    }
}
module.exports = new ApplicationCTRL();


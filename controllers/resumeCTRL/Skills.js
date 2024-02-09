const Resume = require('../../models/resumeSchema'); // Update with the correct path to your model file
const { Users } = require('../../models/users'); // Update with the correct path to your model file
const { handleResponse } = require('../../utils/handleResponse');

// POST - Add or update skills in a user's resume
const addOrUpdateSkills = async (req, res) => {
    if (!req.user) {
        return handleResponse(res, 401, "error", "Unauthorized");
    }
    const { skills } = req.body;

    // Basic validation for skills
    if (!Array.isArray(skills)) {
        return handleResponse(res, 400, "error", "Invalid or missing skills.");
    }

    try {
        // Find the user by ID
        const user = await Users.findById(req.user.id);
        if (!user) {
            return handleResponse(res, 404, "error", "User not found");
        }

        // Check if the user has the 'JobSeeker' role
        if (user.role !== 'JobSeeker') {
            return handleResponse(res, 403, "error", "This operation is only allowed for JobSeekers.");
        }

        // Ensure jobSeeker field is not null
        if (!user.jobSeeker) {
            return handleResponse(res, 404, "error", "JobSeeker profile not found");
        }

        // Update the skills in the user's jobSeeker profile
        user.jobSeeker.skills = skills;

        // Save the user with the updated jobSeeker skills
        await user.save();
        handleResponse(res, 200, "success", "Skills updated", user.jobSeeker.skills, user.jobSeeker.skills.length);
    } catch (error) {
        handleResponse(res, 500, "error", error.message);
    }
};


module.exports = {
    addOrUpdateSkills,
};



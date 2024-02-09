const Resume = require('../../models/resumeSchema'); // Update with the correct path to your model file
const { Users } = require('../../models/users'); // Update with the correct path to your model file
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const { handleResponse } = require('../../utils/handleResponse');
const awardSchema = Joi.object({
    title: Joi.string().required(),
    issuer: Joi.string().required(),
    dateAwarded: Joi.date().iso().required(),
    description: Joi.string().allow('', null),
});

const validateAddAward = (data) => {
    return awardSchema.validate(data);
};
const validateUpdateAward = (data) => {
    return awardSchema.validate(data);
};

// POST - Create a new award entry
const addAward = async (req, res) => {
    if (!req.user) {
        return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
    }
    try {
        const user = await Users.findById(req.user.id);
        if (!user) {
            return handleResponse(res, 404, 'error', 'User not found', {}, 0);
        }

        const resume = await Resume.findById(user.resumeId);
        if (!resume) {
            const newResume = new Resume({
                awards: [{ ...req.body, id: uuidv4() }]
            });
            await newResume.save();
            user.resumeId = newResume._id;
            await user.save();
            return handleResponse(res, 201, 'success', 'New resume created with awards', newResume.awards, newResume.awards.length);
        }

        const { error } = validateAddAward(req.body);
        if (error) {
            return handleResponse(res, 400, 'error', error.details[0].message, {}, 0);
        }

        resume.awards.push({ ...req.body, id: uuidv4() });
        await resume.save();
        return handleResponse(res, 201, 'success', 'Award added successfully', resume.awards, resume.awards.length);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'error', 'An error occurred while adding the award', {}, 0);
    }
};

// GET - Retrieve award entries for a user
const getAwards = async (req, res) => {
    if (!req.user) {
        return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
    }

    try {
        const user = await Users.findById(req.user.id);
        if (!user) {
            return handleResponse(res, 404, 'error', 'User not found', {}, 0);
        }

        const resume = await Resume.findById(user.resumeId);
        if (!resume) {
            return handleResponse(res, 404, 'error', 'Resume not found', {}, 0);
        }

        // Send the awards array as the response
        return handleResponse(res, 200, 'success', 'Awards retrieved successfully', resume.awards, resume.awards.length);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'error', 'An error occurred while retrieving awards', {}, 0);
    }
};
// PUT - Update a specific award entry
const updateAward = async (req, res) => {
    if (!req.user) {
        return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
    }
    const { id } = req.params;
    const updateData = req.body; // The updated data for the award

    try {
        const user = await Users.findById(req.user.id);
        if (!user) {
            return handleResponse(res, 404, 'error', 'User not found', {}, 0);
        }

        const resume = await Resume.findById(user.resumeId);
        if (!resume) {
            return handleResponse(res, 404, 'error', 'Resume not found', {}, 0);
        }

        const awardIndex = resume.awards.findIndex(award => award.id === id);
        if (awardIndex === -1) {
            return handleResponse(res, 404, 'error', 'Award not found', {}, 0);
        }

        // Validate the incoming data
        const { error } = validateUpdateAward(updateData);
        if (error) {
            return handleResponse(res, 400, 'error', error.details[0].message, {}, 0);
        }

        resume.awards[awardIndex] = { ...resume.awards[awardIndex], ...updateData };
        await resume.save();

        return handleResponse(res, 200, 'success', 'Award updated successfully', resume.awards[awardIndex], 1);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'error', 'An error occurred while updating the award', {}, 0);
    }
};

// DELETE - Remove a specific award entry
const deleteAward = async (req, res) => {
    if (!req.user) {
        return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
    }
    const { id } = req.params;

    try {
        const user = await Users.findById(req.user.id);
        if (!user) {
            return handleResponse(res, 404, 'error', 'User not found', {}, 0);
        }

        const resume = await Resume.findById(user.resumeId);
        if (!resume) {
            return handleResponse(res, 404, 'error', 'Resume not found', {}, 0);
        }

        const awardIndex = resume.awards.findIndex(award => award.id === id);
        if (awardIndex === -1) {
            return handleResponse(res, 404, 'error', 'Award not found', {}, 0);
        }

        resume.awards.splice(awardIndex, 1);
        await resume.save();

        return handleResponse(res, 200, 'success', 'Award successfully deleted', {}, 0);
    } catch (error) {
        return handleResponse(res, 500, 'error', 'An error occurred while deleting the award', {}, 0);
    }
};

module.exports = {
    addAward,
    getAwards,
    updateAward,
    deleteAward
};

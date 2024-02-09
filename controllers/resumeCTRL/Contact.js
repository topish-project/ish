const Resume = require('../../models/resumeSchema'); // Update with the correct path to your model file
const { Users } = require('../../models/users');
const { handleResponse } = require('../../utils/handleResponse');
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Helper function to validate phone
function validatePhone(phone) {
    const re = /^\d{9}$/; // Adjust the regex based on your phone number format
    return re.test(phone);
}
const addContact = async (req, res) => {
    if (!req.user) {
        return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
    }

    const { email, phone } = req.body;

    // Basic validation for email, phone, and location
    if (!email || !validateEmail(email)) {
        return handleResponse(res, 400, 'error', "Invalid or missing email address.", {}, 0);
    }
    if (!phone || !validatePhone(phone)) {
        return handleResponse(res, 400, 'error', "Invalid or missing phone number.", {}, 0);
    }


    try {
        const user = await Users.findById(req.user.id);
        if (!user) {
            return handleResponse(res, 404, 'error', 'User not found', {}, 0);
        }

        const resume = await Resume.findById(user.resumeId);
        if (!resume) {
            const newResume = new Resume({
                contact: { email, phone, location }
            });
            await newResume.save();
            user.resumeId = newResume._id;
            await user.save();
            return handleResponse(res, 201, 'success', 'Contact added successfully', newResume.contact, 1);
        }

        resume.contact = { email, phone };
        await resume.save();
        return handleResponse(res, 200, 'success', 'Contact updated successfully', resume.contact, 1);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'error', 'An error occurred while adding/updating the contact', {}, 0);
    }
};
// GET - Retrieve contact information for a user
const getContact = async (req, res) => {
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

        // Check if the contact information exists in the resume
        if (!resume.contact) {
            return handleResponse(res, 404, 'error', 'Contact information not found', {}, 0);
        }

        // Send the contact information as the response
        return handleResponse(res, 200, 'success', 'Contact information retrieved successfully', resume.contact, 1);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'error', 'An error occurred while retrieving contact information', {}, 0);
    }
};

// DELETE - Remove contact information from a user's resume
const deleteContact = async (req, res) => {
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

        // Remove the contact information from the resume
        resume.contact = {
            email: '',
            phone: '',
        };

        // Save the resume with the removed contact information
        await resume.save();

        return handleResponse(res, 200, 'success', 'Contact information successfully deleted', {}, 0);
    } catch (error) {
        console.error(error);
        return handleResponse(res, 500, 'error', 'An error occurred while deleting contact information', {}, 0);
    }
};

module.exports = {
    addContact,
    getContact,
    deleteContact
};

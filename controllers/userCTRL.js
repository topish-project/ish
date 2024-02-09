const { Users } = require("../models/users");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const { handleResponse } = require("../utils/handleResponse");

class UserCTRL {
    //   GET ALL USERS
    async getAllUsers(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            // Determine the target role for searching based on the requester's role
            let targetRole = req.user.role === "Employer" ? "JobSeeker" : "Employer";

            let query = { role: targetRole }; // Filter users based on the target role

            let resultUsers = await Users.find(query)
                .select("phoneNumber role email jobSeeker employer")
                .exec(); // Execute the query and select fields

            if (resultUsers.length === 0) {
                return handleResponse(res, 404, 'info', 'No users found', [], 0);
            }

            // Prepare users data for the response
            const usersData = resultUsers.map(user => {
                // Modify this part as per your requirement to format user data
                return {
                    id: user._id,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    role: user.role,
                    jobSeeker: user.jobSeeker, // Include or exclude based on privacy/security considerations
                    employer: user.employer, // Include or exclude based on privacy/security considerations
                };
            });

            return handleResponse(res, 200, 'success', 'Users retrieved successfully', usersData, usersData.length);
        } catch (error) {
            console.error("Error in getAllUsers function:", error);
            return handleResponse(res, 500, 'error', 'Something went wrong: ' + error.message, {}, 0);
        }
    }
    //  GET CURRENT USER
    async showCurrentUser(req, res) {
        const userId = req.user.id;
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const user = await Users.findById({ _id: userId }).populate({ path: "resumeId" }).select("-password");
            console.log(user)
            if (user) {
                return handleResponse(res, 200, 'success', 'User retrieved successfully', user, 1);
            } else {
                return handleResponse(res, 404, 'error', 'User not found', {}, 0);
            }
        } catch (error) {
            console.error("Error in showCurrentUser function:", error);
            return handleResponse(res, 500, 'error', 'Internal server error', {}, 0);
        }
    }
    async getUser(req, res) {
        const userId = req.params.id;

        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            // Define the target role based on the requester's role
            let targetRole;
            if (req.user.role === "Employer") {
                targetRole = "JobSeeker";
            } else if (req.user.role === "JobSeeker") {
                targetRole = "Employer";
            } else {
                // Handle unexpected roles
                return handleResponse(res, 400, 'error', 'Invalid user role', {}, 0);
            }

            // Query for a user with the target role and the specified ID
            const user = await Users.findOne({ _id: userId, role: targetRole }).populate({ path: "resumeId" }).select("-password");

            if (!user) {
                return handleResponse(res, 400, 'error', 'User not found or access denied', {}, 0);
            }

            // Spread operator (...) is not directly usable here, use user.toObject() if necessary
            return handleResponse(res, 200, 'success', 'User retrieved successfully', { user: user.toObject() }, 1);
        } catch (error) {
            console.error("Error in getUser function:", error);
            return handleResponse(res, 500, 'error', 'Internal server error', {}, 0);
        }
    }
    //  UPDATE USER
    async updateUserNumber(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const { phoneNumber } = req.body;
            if (!phoneNumber) {
                return handleResponse(res, 400, 'error', 'Please provide all values', {}, 0);
            }

            const user = await Users.findOne({ _id: req.user.id });

            user.phoneNumber = phoneNumber;

            await user.save();

            const tokenUser = createTokenUser(user);
            attachCookiesToResponse({ res, user: tokenUser });

            return handleResponse(res, 200, 'success', 'Information updated successfully', tokenUser, 1);
        } catch (error) {
            console.error("Error in updateUser function:", error);
            return handleResponse(res, 500, 'error', 'Internal server error', {}, 0);
        }
    }
    async updateUserEmail(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }
            const { email } = req.body;
            if (!email) {
                return handleResponse(res, 400, 'error', 'Please provide all values', {}, 0);
            }

            const user = await Users.findOne({ _id: req.user.id });

            user.email = email;

            await user.save();

            const tokenUser = createTokenUser(user);
            attachCookiesToResponse({ res, user: tokenUser });

            return handleResponse(res, 200, 'success', 'Information updated successfully', tokenUser, 1);
        } catch (error) {
            console.error("Error in updateUser function:", error);
            return handleResponse(res, 500, 'error', 'Internal server error', {}, 0);
        }
    }
    // UPDATE USER PASSWORD
    async updateUserPassword(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return handleResponse(res, 400, 'error', 'Please provide all values', {}, 0);
            }

            const user = await Users.findOne({ _id: req.user.id });

            const isPasswordCorrect = await user.comparePassword(oldPassword);

            if (!isPasswordCorrect) {
                return handleResponse(res, 401, 'error', 'Invalid Credentials', {}, 0);
            } else {
                user.password = newPassword;
                await user.save();
                return handleResponse(res, 200, 'success', 'Success! Password Updated.', {}, 0);
            }
        } catch (error) {
            console.error("Error in updateUserPassword function:", error);
            return handleResponse(res, 403, 'error', error.message, {}, 0);
        }
    }
    async updateJobSeekerProfile(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }

            const userId = req.user.id;
            const { jobtitle, fullName, gender, birthday, location, expectedSalary, skills } = req.body;

            if (req.user.role === 'JobSeeker') {
                // Update the job seeker's profile
                const updatedUser = await Users.findByIdAndUpdate(userId, {
                    $set: {
                        "jobSeeker.jobtitle": jobtitle,
                        "jobSeeker.fullName": fullName,
                        "jobSeeker.gender": gender,
                        "jobSeeker.birthday": birthday,
                        "jobSeeker.location": location,
                        "jobSeeker.expectedSalary": expectedSalary,
                        "jobSeeker.skills": skills
                    }
                }, { new: true, runValidators: true });

                if (!updatedUser) {
                    return handleResponse(res, 404, 'error', 'User not found', {}, 0);
                }

                return handleResponse(res, 200, 'success', 'Profile updated successfully', updatedUser, 1);
            } else {
                // Logic for updating the employer's profile can be added here
                return handleResponse(res, 400, 'error', 'Update operation is not supported for this user role.', {}, 0);
            }
        } catch (error) {
            console.error("Error in updateUserProfile function:", error);
            return handleResponse(res, 500, 'error', 'Internal server error', {}, 0);
        }
    }
    async updateEmployerProfile(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized', {}, 0);
            }
            const userId = req.user.id;
            const { fullName, companyName, industry, location, aboutcompany, number, email } = req.body;

            if (req.user.role === 'Employer') {
                // Update the job seeker's profile
                const updatedUser = await Users.findByIdAndUpdate(userId, {
                    $set: {
                        "employer.companyName": companyName,
                        "employer.fullName": fullName,
                        "employer.industry": industry,
                        "employer.aboutcompany": aboutcompany,
                        "employer.location": location,
                        "employer.contactNumber": number,
                        "employer.contactEmail": email,

                    }
                }, { new: true, runValidators: true });

                if (!updatedUser) {
                    return handleResponse(res, 404, 'error', 'User not found', {}, 0);
                }

                return handleResponse(res, 200, 'success', 'Profile updated successfully', updatedUser, 1);
            } else {
                // Logic for updating the employer's profile can be added here
                return handleResponse(res, 400, 'error', 'Update operation is not supported for this user role.', {}, 0);
            }
        } catch (error) {
            console.error("Error in updateUserProfile function:", error);
            return handleResponse(res, 500, 'error', 'Internal server error', {}, 0);
        }
    }
}

module.exports = new UserCTRL();
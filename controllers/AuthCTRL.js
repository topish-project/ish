const { Users } = require("../models/users");
const Resume = require("../models/resumeSchema");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const Joi = require('joi');
const { handleResponse } = require("../utils/handleResponse");
const { deleteUserAvatar } = require("./avatarCTRL");
const { deleteUserCv } = require("./resumeCTRL/Cv");

// const {
//     sendConfirmationCodeViaEmail,
//     saveConfirmationCodeByEmail,
//     getConfirmationCodeByEmail,
//     markEmailAsConfirmed,
//     checkEmailConfirmationStatus,
// } = require("./SendCodeCTRL");

class AuthCTRL {
    // register
    async register(req, res) {
        try {
            // Define the validation schema
            const registrationSchema = Joi.object({
                phoneNumber: Joi.string().regex(/^\d{9}$/).allow(null, ''),
                email: Joi.string().email().allow(null, ''), // Ensures a valid email is required
                password: Joi.string().min(6).required(), // At least 6 characters
                confirmPassword: Joi.string().valid(Joi.ref('password')).required(), // Must match password
                role: Joi.string().valid('JobSeeker', 'Employer').required(), // Must be one of the roles
            });

            const { error, value } = registrationSchema.validate(req.body);
            if (error) {
                return handleResponse(res, 400, 'error', error.details[0].message);
            }
            const { phoneNumber, email, password, role } = value;


            // Check if both phoneNumber and email are empty
            if (phoneNumber === "" && email === "") {
                return handleResponse(res, 400, 'error', 'At least one of phoneNumber or email must have a value');
            }

            // Check if a user with the same phone number or email already exists
            const existingUser = await Users.findOne({
                $or: [
                    { phoneNumber: phoneNumber.length > 0 ? `+998${phoneNumber}` : null },
                    { email: email.length > 0 ? email : null },
                ],
            });

            if (existingUser) {
                return handleResponse(res, 400, 'error', 'User already exists with this phone number or email');
            }

            // Check if there is a user with the same combination of email and phoneNumber
            const userWithSameCombination = await Users.findOne({
                $and: [
                    { phoneNumber: phoneNumber ? `+998${phoneNumber}` : '' }, // Add prefix if phoneNumber is not empty, or store as empty string
                    { email: email || '' }, // Store email as provided or as an empty string if not provided
                ],
            });

            if (userWithSameCombination) {
                return handleResponse(res, 400, 'error', 'User with this combination of phone number and email already exists');
            }

            // const isEmailConfirmed = await checkEmailConfirmationStatus(email);
            // const isPhoneNumberConfirmed = await checkPhoneNumberConfirmationStatus(
            //   phoneNumber
            // );

            const jobSeekerData = {
                fullName: "",
                location: "",
            };

            const employerData = {
                companyName: "",
                fullName: "",
            };

            let savedResume = null;
            const resume = new Resume({
                summary: "",
                industry: [],
                contact: {
                    email: "",
                    phone: "",
                    location: "",
                },
                workExperience: [],
                education: [],
                projects: [],
                certificates: [],
                awards: [],
                languages: [],
                skills: [],
                cv: []
            });
            savedResume = await resume.save();

            // Create user
            const user = new Users({
                phoneNumber: phoneNumber ? `+998${phoneNumber}` : '',
                email: email || '',
                phoneConfirmed: false,
                emailConfirmed: false,
                password,
                role,
                resumeId: savedResume._id,
                // Spread the correct object based on the role
                ...(role === "JobSeeker"
                    ? {
                        jobSeeker: jobSeekerData,
                    }
                    : {
                        employer: employerData
                    }
                ),
            });
            await user.save();
            const tokenUser = createTokenUser(user);
            attachCookiesToResponse({ res, user: tokenUser });
            return handleResponse(res, 201, 'success', 'User registered successfully', tokenUser);
        } catch (error) {
            console.error(error);
            return handleResponse(res, 500, 'error', 'Something went wrong');
        }
    };
    // confirm email or phone number
    async initiateCodeSending(req, res) {
        try {
            const { email, phoneNumber } = req.body;
            let confirmationCode;

            if (email) {
                confirmationCode = generateConfirmationCode(); // assuming this function is defined elsewhere
                await saveConfirmationCodeByEmail(email, confirmationCode); // assuming this function is defined elsewhere
                sendConfirmationCodeViaEmail(email, confirmationCode); // assuming this function is defined elsewhere
            } else if (phoneNumber) {
                confirmationCode = generateConfirmationCode(); // assuming this function is defined elsewhere
                await saveConfirmationCodeByPhoneNumber(phoneNumber, confirmationCode); // assuming this function is defined elsewhere
                sendConfirmationCodeViaPhoneNumber(phoneNumber, confirmationCode); // assuming this function is defined elsewhere
            } else {
                return handleResponse(res, 400, 'error', 'Email or phone number is required', {}, 0);
            }

            handleResponse(res, 200, 'success', 'Confirmation code sent successfully', {}, 0);
        } catch (error) {
            console.error(error);
            handleResponse(res, 500, 'error', 'Something went wrong during code sending.', {}, 0);
        }
    }

    // confirm email or phone number with code
    async confirmEmailOrPhoneNumberWithCode(req, res) {
        try {
            const { email, phoneNumber, confirmationCode } = req.body;
            let savedCode;

            if (email) {
                savedCode = await getConfirmationCodeByEmail(email); // assuming this function is defined elsewhere
            } else if (phoneNumber) {
                savedCode = await getConfirmationCodeByPhoneNumber(phoneNumber); // assuming this function is defined elsewhere
            } else {
                return handleResponse(res, 400, 'error', 'Email or phone number is required', {}, 0);
            }

            if (savedCode === confirmationCode) {
                if (email) {
                    await markEmailAsConfirmed(email); // assuming this function is defined elsewhere
                } else if (phoneNumber) {
                    await markPhoneNumberAsConfirmed(phoneNumber); // assuming this function is defined elsewhere
                }
                handleResponse(res, 200, 'success', 'Confirmation successful', {}, 0);
            } else {
                handleResponse(res, 400, 'error', 'Invalid confirmation code', {}, 0);
            }
        } catch (error) {
            console.error(error);
            handleResponse(res, 500, 'error', 'Something went wrong during confirmation.', {}, 0);
        }
    }

    // generate confirmation code
    async generateConfirmationCode() {
        const min = 100000; // Minimum 6-digit number (100000)
        const max = 999999; // Maximum 6-digit number (999999)

        // Generate a random number between min and max (inclusive)
        const code = Math.floor(Math.random() * (max - min + 1)) + min;

        // Convert the code to a string to ensure it has exactly 6 digits
        return code.toString();
    };
    // generate random fullname
    async generateRandomFullname() {
        // You can implement your logic here to generate a random Fullname
        // For example, you can concatenate random first and last names
        const firstName = "User";
        const randomNumber = Math.floor(Math.random() * 1000000);
        return `${firstName} ${randomNumber}`;
    };

    async generateRandomCompanyName() {
        const companyNames = [
            "Acme Corporation",
            "Globex Corporation",
            "Wayne Enterprises",
            "Stark Industries",
            "Umbrella Corporation",
            "Initech",
            "Cyberdyne Systems",
            "Weyland-Yutani Corporation",
            "Oscorp Industries",
            "LexCorp",
        ];

        const randomIndex = Math.floor(Math.random() * companyNames.length);
        return companyNames[randomIndex];
    };
    // sign in
    async login(req, res) {
        try {
            const { email, phoneNumber, password } = req.body;
            console.log(req.body)
            if (!phoneNumber && !email) {
                return handleResponse(res, 400, 'error', 'At least one of phoneNumber or email must have a value', {}, 0);
            }

            const user = await Users.findOne({
                $or: [
                    { phoneNumber: phoneNumber ? `+998${phoneNumber}` : null },
                    { email: email ? email : null },
                ],
            });

            if (!user) {
                return handleResponse(res, 400, 'error', 'Invalid email/phone number or password.', {}, 0);
            }

            const isPasswordCorrect = await user.comparePassword(password);
            if (!isPasswordCorrect) {
                return handleResponse(res, 400, 'error', 'Invalid email/phone number or password.', {}, 0);
            }

            const tokenUser = createTokenUser(user);
            attachCookiesToResponse({ res, user: tokenUser });

            return handleResponse(res, 200, 'success', 'Login successful', tokenUser, 1);
        } catch (error) {
            console.error(error);
            return handleResponse(res, 500, 'error', 'Something went wrong during the login process.', {}, 0);
        }
    };
    // sign out
    async signOut(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized!', {}, 0);
            }
            res.cookie("token", "logout", {
                httpOnly: true,
                expires: new Date(Date.now() + 1000),
            });
            return handleResponse(res, 200, 'success', 'User logged out!', {}, 0);
        } catch (error) {
            console.error(error);
            return handleResponse(res, 500, 'error', 'Something went wrong during the sign out process.', {}, 0);
        }
    };

    async deleteAccount(req, res) {
        try {
            if (!req.user) {
                return handleResponse(res, 401, 'error', 'Unauthorized!', {}, 0);
            }

            const userID = req.user.id;
            const user = await Users.findById(userID);
            if (!user) {
                return handleResponse(res, 404, 'error', 'User not found', {}, 0);
            }
            if (user.resumeId) {
                const resume = await Resume.findById(user.resumeId);
                if (resume) {
                    // Assuming avatarCTRL.deleteAvatar() and deleteCvFile() return Promises
                    // Also assuming they need user or resume info to delete specific files
                    await Promise.all([
                        deleteUserAvatar(req.user.id),
                        deleteUserCv(req.user.id)
                    ]);
                    await resume.remove();
                }
            }

            await user.remove();

            res.cookie("token", "", {
                httpOnly: true,
                expires: new Date(Date.now()),
            });

            handleResponse(res, 200, 'success', 'Account and associated data deleted successfully', {}, 0);
        } catch (err) {
            console.error(err);
            handleResponse(res, 500, 'error', 'An error occurred while deleting the account.', {}, 0);
        }
    };
}

module.exports = new AuthCTRL();


// swaggerSchemas.js


const AuthEndpoints = {
    tags: [
        {
            name: 'Auth',
            description: 'The Auth managing API',
        },
    ],
    '/auth/create-user': {
        post: {
            summary: 'Register a new user',
            tags: ['Auth'],
            description: 'Endpoint for user registration. Registers a new user with the provided details.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['phoneNumber', 'email', 'password', 'confirmPassword', 'role'],
                            properties: {
                                phoneNumber: {
                                    type: 'string',
                                    description: 'User\'s phone number',
                                    example: '934440000',
                                    pattern: '^[0-9]+$'  // Optional: Add a regex pattern to ensure the phone number contains only digits
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    description: 'User\'s email address',
                                    example: '',
                                },
                                password: {
                                    type: 'string',
                                    format: 'password',
                                    description: 'User\'s password',
                                    example: 'securepassword',
                                },
                                confirmPassword: {
                                    type: 'string',
                                    format: 'password',
                                    description: 'Confirmation of the user\'s password',
                                    example: 'securepassword',
                                },
                                role: {
                                    type: 'string',
                                    enum: ['JobSeeker', 'Employer'],
                                    description: 'Role of the user in the system',
                                    example: 'JobSeeker',
                                },
                            }
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'User registered successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { type: 'string' },
                                    msg: { type: 'string' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string' },
                                            phoneNumber: { type: 'string' },
                                            coins: { type: 'number' },
                                            id: { type: 'string' },
                                            role: { type: 'string' },
                                            favorites: { type: 'array', items: {} },
                                            oneOf: [
                                                {
                                                    type: 'object',
                                                    properties: {
                                                        // Properties specific to JobSeeker
                                                        jobSeeker: {
                                                            type: 'object',
                                                            properties: {
                                                                email: { type: 'string' },
                                                                phoneNumber: { type: 'string' },
                                                                coins: { type: 'number' },
                                                                id: { type: 'string' },
                                                                role: { type: 'string' },
                                                                favorites: { type: 'array', items: {} },
                                                                employer: {
                                                                    type: 'object',
                                                                    properties: {
                                                                        fullName: { type: 'string' },
                                                                        companyName: { type: 'string' },
                                                                        about: { type: 'string' },
                                                                        industry: { type: 'array', items: { type: 'string' } },
                                                                        contact: { type: 'array', items: { type: 'string' } },
                                                                        location: { type: 'string' },
                                                                        isVerified: { type: 'boolean' },
                                                                        jobs: { type: 'array', items: { type: 'string' } },
                                                                        _id: { type: 'string' },
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    type: 'object',
                                                    properties: {
                                                        // Properties specific to Employer
                                                        employer: {
                                                            type: 'object',
                                                            properties: {
                                                                email: {
                                                                    type: 'string',
                                                                    example: 'user@example.com',
                                                                },
                                                                phoneNumber: {
                                                                    type: 'string',
                                                                    example: '+998939992222',
                                                                },
                                                                coins: {
                                                                    type: 'number',
                                                                    example: 50,
                                                                },
                                                                id: {
                                                                    type: 'string',
                                                                    example: '65c277b2ed4e7c821def862a',
                                                                },
                                                                role: {
                                                                    type: 'string',
                                                                    example: 'Employer',
                                                                },
                                                                favorites: {
                                                                    type: 'array',
                                                                    items: {},
                                                                },
                                                                employer: {
                                                                    type: 'object',
                                                                    properties: {
                                                                        fullName: {
                                                                            type: 'string',
                                                                            example: 'Asadbek Alimov',
                                                                        },
                                                                        companyName: {
                                                                            type: 'string',
                                                                            example: 'AliExpress',
                                                                        },
                                                                        about: {
                                                                            type: 'string',
                                                                            example: '',
                                                                        },
                                                                        industry: {
                                                                            type: 'array',
                                                                            items: {
                                                                                type: 'string',
                                                                            },
                                                                        },
                                                                        contact: {
                                                                            type: 'array',
                                                                            items: {
                                                                                type: 'string',
                                                                            },
                                                                        },
                                                                        location: {
                                                                            type: 'string',
                                                                            example: '',
                                                                        },
                                                                        isVerified: {
                                                                            type: 'boolean',
                                                                            example: false,
                                                                        },
                                                                        jobs: {
                                                                            type: 'array',
                                                                            items: {
                                                                                type: 'string',
                                                                            },
                                                                        },
                                                                        _id: {
                                                                            type: 'string',
                                                                            example: '65c277b2ed4e7c821def862b',
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    totalCount: { type: 'number' }
                                }
                            }
                        }
                    },
                },
                '400': {
                    description: 'Bad request (e.g., user already exists, passwords do not match, required fields missing, invalid phone or email)',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: {
                                        type: 'string',
                                        example: 'error',
                                    },
                                    msg: {
                                        type: 'string',
                                        example: 'User already exists with this phone number or email',
                                    },
                                    data: {
                                        type: 'object',
                                        additionalProperties: true,
                                    },
                                    totalCount: {
                                        type: 'number',
                                        example: 0,
                                    },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: {
                                        type: 'string',
                                        example: 'error',
                                    },
                                    msg: {
                                        type: 'string',
                                        example: 'Something went wrong',
                                    },
                                    data: {
                                        type: 'object',
                                        additionalProperties: true,
                                    },
                                    totalCount: {
                                        type: 'number',
                                        example: 0,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    '/auth/sign-in': {
        post: {
            summary: 'Login',
            tags: ['Auth'],
            description: 'Endpoint for user login. Authenticates the user and returns an auth token along with user information.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'password'],
                            properties: {
                                phoneNumber: {
                                    type: 'string',
                                    description: 'User\'s phone number',
                                    example: '934440000',
                                    pattern: '^[0-9]+$'  // Optional: Add a regex pattern to ensure the phone number contains only digits
                                },
                                email: {
                                    example: '',
                                    type: 'string',
                                    format: 'email',
                                    description: 'Email of the user.'
                                },
                                password: {
                                    type: 'string',
                                    format: 'password',
                                    description: 'Password for the account.',
                                    example: 'securepassword',
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'User logged in successfully.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { type: 'string', example: 'success' },
                                    msg: { type: 'string', example: 'Login successful' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            email: { type: 'string', example: '' },
                                            phoneNumber: { type: 'string', example: '+998939993333' },
                                            coins: { type: 'number', example: 50 },
                                            id: { type: 'string', example: '65c2229d6820d7cc9044b411' },
                                            role: { type: 'string', example: 'JobSeeker' },
                                            favorites: {
                                                type: 'array',
                                                items: {},
                                            },
                                            jobSeeker: {
                                                type: 'object',
                                                properties: {
                                                    fullName: { type: 'string', example: 'Asadbek Alimov' },
                                                    gender: { type: 'string', example: 'Choose' },
                                                    skills: {
                                                        type: 'array',
                                                        items: { type: 'string' },
                                                    },
                                                    isVerified: { type: 'boolean', example: false },
                                                    location: { type: 'string', example: 'Toshkent' },
                                                    expectedSalary: { type: 'number', example: 0 },
                                                    jobtitle: { type: 'string', example: 'Developer' },
                                                    experience: { type: 'string', example: '1-2 year' },
                                                    employmentType: { type: 'string', example: 'full-time' },
                                                    _id: { type: 'string', example: '65c2229d6820d7cc9044b412' },
                                                },
                                            },
                                            employer: {
                                                type: 'object',
                                                properties: {
                                                    fullName: { type: 'string', example: 'Asadbek Alimov' },
                                                    companyName: { type: 'string', example: 'AliExpress' },
                                                    about: { type: 'string', example: '' },
                                                    industry: {
                                                        type: 'array',
                                                        items: { type: 'string' },
                                                    },
                                                    contact: {
                                                        type: 'array',
                                                        items: { type: 'string' },
                                                    },
                                                    location: { type: 'string', example: '' },
                                                    isVerified: { type: 'boolean', example: false },
                                                    jobs: {
                                                        type: 'array',
                                                        items: { type: 'string' },
                                                    },
                                                    _id: { type: 'string', example: '65c21b10b811045e6c02fc2e' },
                                                },
                                            },
                                        },
                                    },
                                    totalCount: { type: 'number', example: 1 },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Unauthorized. Incorrect email or password.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { type: 'string', example: 'error' },
                                    msg: { type: 'string', example: 'Incorrect email or password.' },
                                    data: { type: 'object', example: null },
                                    totalCount: { type: 'number', example: 0 },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Internal server error.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { type: 'string', example: 'error' },
                                    msg: { type: 'string', example: 'Internal server error.' },
                                    data: { type: 'object', example: null },
                                    totalCount: { type: 'number', example: 0 },
                                },
                            },
                        },
                    },
                },
            }
        }
    },
    '/auth/sign-out': {
        post: {
            summary: 'Sign out the current user',
            tags: ['Auth'],
            description: 'Endpoint for signing out the current user. This clears the user\'s auth token.',
            security: [
                {
                    cookieAuth: []  // Assuming you are using cookie-based authentication
                }
            ],
            responses: {
                '200': {
                    description: 'User logged out successfully.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { type: 'string', example: 'success' },
                                    msg: { type: 'string', example: 'User logged out!' },
                                    data: { type: 'object', example: {} },
                                    totalCount: { type: 'number', example: 0 },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Unauthorized. User is not authenticated or token is invalid.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { type: 'string', example: 'error' },
                                    msg: { type: 'string', example: 'Unauthorized!' },
                                    data: { type: 'object', example: {} },
                                    totalCount: { type: 'number', example: 0 },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Internal server error. Something went wrong during the sign out process.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { type: 'string', example: 'error' },
                                    msg: { type: 'string', example: 'Something went wrong during the sign out process.' },
                                    data: { type: 'object', example: {} },
                                    totalCount: { type: 'number', example: 0 },
                                },
                            },
                        },
                    },
                },
            },
        }
    },
    '/auth/deleteAccount': {
        delete: {
            summary: 'Delete a user account',
            tags: ['Auth'],
            description: 'This endpoint deletes a user\'s account. It requires the user to be authenticated.',
            security: [
                {
                    cookieAuth: []
                }
            ],
            responses: {
                '200': {
                    description: 'Account deleted successfully.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { type: 'string', example: 'success' },
                                    msg: { type: 'string', example: 'Account deleted successfully' },
                                    data: { type: 'object', example: {} },
                                    totalCount: { type: 'number', example: 0 },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Unauthorized. User is not authenticated or token is invalid.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { type: 'string', example: 'error' },
                                    msg: { type: 'string', example: 'Unauthorized!' },
                                    data: { type: 'object', example: {} },
                                    totalCount: { type: 'number', example: 0 },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Internal server error. An error occurred while deleting the account.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: { type: 'string', example: 'error' },
                                    msg: { type: 'string', example: 'An error occurred while deleting the account.' },
                                    data: { type: 'object', example: {} },
                                    totalCount: { type: 'number', example: 0 },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
// authEndpoints.js

module.exports = { AuthEndpoints };


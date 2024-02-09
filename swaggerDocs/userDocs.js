const UsersEndpoint = {
    tags: [
        {
            name: 'Users',
            description: 'The Auth managing API',
        },
    ],
    '/users/allUsers': {
        get: {
            summary: 'Retrieve all users',
            tags: ['Users'],
            description: 'Endpoint to retrieve all user profiles.',
            responses: {
                '200': {
                    description: 'A list of all user profiles.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: {
                                        type: 'string',
                                        example: 'success',
                                    },
                                    msg: {
                                        type: 'string',
                                        example: 'Users retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            searchedUsers: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/UserResponse',
                                                },
                                            },
                                            totalUsers: {
                                                type: 'integer',
                                                example: 3,
                                            },
                                        },
                                        example: {
                                            data: [
                                                {
                                                    _id: '65af1bd9754929656269be11',
                                                    phoneNumber: '1234567840',
                                                    email: 'user5@example.com',
                                                    role: 'JobSeeker',
                                                    jobSeeker: {
                                                        fullName: 'User 650798',
                                                        gender: 'Choose',
                                                        skills: [],
                                                        isVerified: false,
                                                        currentLocation: 'Toshkent',
                                                        _id: '65af1bd9754929656269be12',
                                                    },
                                                },
                                            ],
                                            totalUsers: 3,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Unauthorized access attempt.',
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
                                        example: 'Unauthorized',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    totalCount: {
                                        type: 'integer',
                                        example: 0,
                                    },
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
                                    result: {
                                        type: 'string',
                                        example: 'error',
                                    },
                                    msg: {
                                        type: 'string',
                                        example: 'Something went wrong: <error message>',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    totalCount: {
                                        type: 'integer',
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
    '/users/allUsers/{userId}': {
        get: {
            summary: 'Retrieve a single user',
            tags: ['Users'],
            description: 'Endpoint to retrieve a user profile by ID. Requires authentication.',
            parameters: [
                {
                    in: 'path',
                    name: 'userId',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the user.',
                },
            ],
            responses: {
                '200': {
                    description: 'A single user profile without password.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: {
                                        type: 'string',
                                        example: 'success',
                                    },
                                    msg: {
                                        type: 'string',
                                        example: 'User retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: { type: 'string' },
                                            phoneNumber: { type: 'string' },
                                            email: { type: 'string' },
                                            phoneConfirmed: { type: 'boolean' },
                                            emailConfirmed: { type: 'boolean' },
                                            accountVisibility: { type: 'boolean' },
                                            friends: {
                                                type: 'array',
                                                items: { type: 'string' }, // or a more detailed schema if applicable
                                            },
                                            role: { type: 'string' },
                                            jobSeeker: {
                                                type: 'object',
                                                properties: {
                                                    // Define jobSeeker properties here
                                                }
                                            },
                                            resumeId: {
                                                type: 'object',
                                                properties: {
                                                    // Define resumeId properties here
                                                }
                                            },
                                            tokens: {
                                                type: 'array',
                                                items: { type: 'string' },
                                            },
                                            coins: { type: 'number' },
                                            favorites: {
                                                type: 'array',
                                                items: { type: 'string' },
                                            },
                                            avatar: { type: 'string' },
                                            lastSeen: { type: 'string', format: 'date-time' },
                                            createdAt: { type: 'string', format: 'date-time' },
                                            __v: { type: 'number' },
                                        },
                                    },
                                    totalCount: {
                                        type: 'integer',
                                        example: 1,
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'User not found.',
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
                                        example: 'User not found',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    totalCount: {
                                        type: 'integer',
                                        example: 0,
                                    },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Unauthorized access attempt.',
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
                                        example: 'Unauthorized!',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    totalCount: {
                                        type: 'integer',
                                        example: 0,
                                    },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Internal server error or exception thrown.',
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
                                        example: 'Internal server error',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    totalCount: {
                                        type: 'integer',
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
    '/users/currentUser': {
        get: {
            summary: 'Get the current authenticated user\'s profile',
            tags: ['Users'],
            description: 'Endpoint to retrieve the profile of the current authenticated user.',
            responses: {
                '200': {
                    description: 'The profile of the current user.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: {
                                        type: 'string',
                                        example: 'success',
                                    },
                                    msg: {
                                        type: 'string',
                                        example: 'User retrieved successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '65c32d9a161b1868b18862c7',
                                            },
                                            phoneNumber: {
                                                type: 'string',
                                                example: '+998934440022',
                                            },
                                            email: {
                                                type: 'string',
                                                example: '',
                                            },
                                            phoneConfirmed: {
                                                type: 'boolean',
                                                example: false,
                                            },
                                            emailConfirmed: {
                                                type: 'boolean',
                                                example: false,
                                            },
                                            accountVisibility: {
                                                type: 'boolean',
                                                example: false,
                                            },
                                            friends: {
                                                type: 'array',
                                                items: {},
                                            },
                                            role: {
                                                type: 'string',
                                                example: 'Employer',
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
                                                    // Additional properties as defined in your response
                                                },
                                            },
                                            tokens: {
                                                type: 'array',
                                                items: {},
                                            },
                                            coins: {
                                                type: 'number',
                                                example: 50,
                                            },
                                            favorites: {
                                                type: 'array',
                                                items: {},
                                            },
                                            avatar: {
                                                type: 'string',
                                                example: '',
                                            },
                                            lastSeen: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2024-02-07T07:13:30.692Z',
                                            },
                                            createdAt: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2024-02-07T07:13:30.692Z',
                                            },
                                        },
                                    },
                                    totalCount: {
                                        type: 'integer',
                                        example: 1,
                                    },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Unauthorized access, no or invalid authentication token provided.',
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
                                        example: 'Unauthorized!',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    totalCount: {
                                        type: 'integer',
                                        example: 0,
                                    },
                                },
                            },
                        },
                    },
                },
                '404': {
                    description: 'The user profile was not found.',
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
                                        example: 'User not found',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    totalCount: {
                                        type: 'integer',
                                        example: 0,
                                    },
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
                                    result: {
                                        type: 'string',
                                        example: 'error',
                                    },
                                    msg: {
                                        type: 'string',
                                        example: 'Internal server error',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    totalCount: {
                                        type: 'integer',
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
    '/users/updateJobSeekerProfile': {
        put: {
            summary: "Update JobSeeker profile",
            description: "Update JobSeeker profile based on user role (JobSeeker or Employer)",
            tags: ["Users"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                jobtitle: { type: "string", example: "Software Developer" },
                                fullName: { type: "string", example: "John Doe" },
                                gender: { type: "string", example: "Male" },
                                birthday: { type: "string", example: "1990-01-01" },
                                location: { type: "string", example: "Tashkent" },
                                expectedSalary: { type: "string", example: "0-10000" },
                                skills: {
                                    type: "array",
                                    items: { type: "string" },
                                    example: ["JavaScript", "React", "Node.js"]
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Profile updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: { type: "string", example: "success" },
                                    msg: { type: "string", example: "Profile updated successfully" },
                                    data: { $ref: "#/components/schemas/Users" },
                                    totalCount: { type: "integer", example: 1 }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Update operation is not supported for this user role",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: { type: "string", example: "error" },
                                    msg: { type: "string", example: "Update operation is not supported for this user role." },
                                    data: { type: "object", example: {} },
                                    totalCount: { type: "integer", example: 0 }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: { type: "string", example: "error" },
                                    msg: { type: "string", example: "Unauthorized" },
                                    data: { type: "object", example: {} },
                                    totalCount: { type: "integer", example: 0 }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "User not found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: { type: "string", example: "error" },
                                    msg: { type: "string", example: "User not found" },
                                    data: { type: "object", example: {} },
                                    totalCount: { type: "integer", example: 0 }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: { type: "string", example: "error" },
                                    msg: { type: "string", example: "Internal server error" },
                                    data: { type: "object", example: {} },
                                    totalCount: { type: "integer", example: 0 }
                                }
                            }
                        }
                    }
                }
            }
        },
    },
    '/users/updateEmployerProfile': {
        put: {
            summary: "Update Employer profile",
            description: "Update Employer profile based on user role (JobSeeker or Employer)",
            tags: ["Users"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                companyName: { type: "string", example: "Google" },
                                fullName: { type: "string", example: "John Doe" },
                                industry: { type: "string", example: "IT" },
                                aboutcompany: { type: "string", example: "Google is a multinational technology company" },
                                location: { type: "string", example: "Andijon" },
                                number: { type: "string", example: "1234567890" },
                                email: { type: "string", example: "kkd@gmail.com" },
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Profile updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: { type: "string", example: "success" },
                                    msg: { type: "string", example: "Profile updated successfully" },
                                    data: { $ref: "#/components/schemas/Users" },
                                    totalCount: { type: "integer", example: 1 }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Update operation is not supported for this user role",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: { type: "string", example: "error" },
                                    msg: { type: "string", example: "Update operation is not supported for this user role." },
                                    data: { type: "object", example: {} },
                                    totalCount: { type: "integer", example: 0 }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "Unauthorized",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: { type: "string", example: "error" },
                                    msg: { type: "string", example: "Unauthorized" },
                                    data: { type: "object", example: {} },
                                    totalCount: { type: "integer", example: 0 }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "User not found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: { type: "string", example: "error" },
                                    msg: { type: "string", example: "User not found" },
                                    data: { type: "object", example: {} },
                                    totalCount: { type: "integer", example: 0 }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "Internal server error",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    result: { type: "string", example: "error" },
                                    msg: { type: "string", example: "Internal server error" },
                                    data: { type: "object", example: {} },
                                    totalCount: { type: "integer", example: 0 }
                                }
                            }
                        }
                    }
                }
            }
        },
    },

};

module.exports = { UsersEndpoint };


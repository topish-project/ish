const JobSeekersEndpoint = {
    tags: [
        {
            name: 'JobSeekers',
            description: 'The JobSeekers managing API',
        },
    ],
    '/users/getAllJobSeekers': {
        get: {
            summary: 'Get all job seeker profiles',
            tags: ['JobSeekers'],
            description: 'Endpoint to retrieve all job seeker profiles. Requires authentication.',
            security: [
                {
                    bearerAuth: [] // assumes you have defined bearerAuth under securitySchemes
                }
            ],
            responses: {
                "200": {
                    "description": "A list of all job seeker profiles.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "A list of all job seeker profiles." },
                                    "data": {
                                        "type": "array",
                                        "items": {
                                            "$ref": "#/components/schemas/JobSeeker"
                                        }
                                    },
                                    "totalUsers": {
                                        "type": "integer",
                                        "example": 10
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized access, no or invalid authentication token provided.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Unauthorized access, no or invalid authentication token provided." },
                                    "data": { "type": "null" },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "No job seeker profiles found.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "No job seeker profiles found." },
                                    "data": { "type": "null" },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Internal server error or exception thrown.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Internal server error or exception thrown." },
                                    "data": { "type": "null" },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/users/searchJobSeekers': {
        get: {
            summary: 'Search job seeker profiles by skills',
            tags: ['JobSeekers'],
            description: 'Endpoint to search for job seeker profiles by specific skills. Requires authentication.',
            parameters: [
                {
                    in: 'query',
                    name: 'skills',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Skills to search for in job seeker profiles',
                },
            ],
            responses: {
                "200": {
                    "description": "A list of job seeker profiles that match the skills query.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "A list of job seeker profiles that match the skills query." },
                                    "data": {
                                        "type": "array",
                                        "items": {
                                            "$ref": "#/components/schemas/JobSeeker"
                                        }
                                    },
                                    "totalUsers": {
                                        "type": "integer",
                                        "example": 10
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Bad Request - Skills parameter missing or invalid.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "error" },
                                    "msg": { "type": "string", "example": "Please enter skills!" },
                                    "data": { "type": "object", "example": {} },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized access, no or invalid authentication token provided.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Unauthorized access, no or invalid authentication token provided." },
                                    "data": { "type": "null" },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "No job seeker profiles found matching the skills query.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "No job seeker profiles found matching the skills query." },
                                    "data": { "type": "null" },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Internal server error or exception thrown.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Internal server error or exception thrown." },
                                    "data": { "type": "null" },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/users/getJobSeekersByName': {
        get: {
            summary: 'Search job seeker profiles by name',
            tags: ['JobSeekers'],
            description: 'Endpoint to search for job seeker profiles by full name. Requires authentication.',
            parameters: [
                {
                    in: 'query',
                    name: 'fullName',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Full name to search for in job seeker profiles',
                },
            ],
            responses: {
                "200": {
                    "description": "A list of job seeker profiles that match the full name query.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "A list of job seeker profiles that match the full name query." },
                                    "data": {
                                        "type": "array",
                                        "items": {
                                            "$ref": "#/components/schemas/JobSeeker"
                                        }
                                    },
                                    "totalUsers": {
                                        "type": "integer",
                                        "example": 10
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Bad Request - Full name parameter missing or invalid.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "error" },
                                    "msg": { "type": "string", "example": "Please enter a valid full name." },
                                    "data": { "type": "null" },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized access, no or invalid authentication token provided.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Unauthorized access, no or invalid authentication token provided." },
                                    "data": { "type": "null" },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "No job seeker profiles found matching the full name query.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "No job seeker profiles found matching the full name query." },
                                    "data": { "type": "null" },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "500": {
                    "description": "Internal server error or exception thrown.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Internal server error or exception thrown." },
                                    "data": { "type": "null" },
                                    "totalUsers": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = {
    JobSeekersEndpoint
};


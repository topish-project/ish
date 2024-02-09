
const JobsEndpoint = {
    tags: [
        {
            name: 'Jobs',
            description: 'The Jobs managing API',
        },
    ],
    '/jobs': {
        post: {
            summary: 'Create a new job',
            tags: ['Jobs'],
            description: 'Endpoint to create a new job listing. Requires authentication and appropriate role.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                title: {
                                    type: 'string',
                                    required: true,
                                    example: 'Software Engineer'
                                },
                                image: {
                                    type: 'string',
                                    example: 'https://example.com/image.jpg'
                                },
                                description: {
                                    type: 'string',
                                    example: 'Job description here'
                                },
                                salary: {
                                    type: 'number',
                                    example: 50000
                                },
                                jobStatus: {
                                    type: 'string',
                                    enum: ['Open', 'Closed', 'Expired'],
                                    default: 'Open',
                                    example: 'Open'
                                },
                                jobType: {
                                    type: 'string',
                                    enum: ['Full-time', 'Freelance', 'Part-time', 'negotiable'],
                                    default: 'Full-time',
                                    example: 'Full-time'
                                },
                                MinQualification: {
                                    type: 'string',
                                    example: 'Bachelor\'s Degree'
                                },
                                benefits: {
                                    type: 'string',
                                    example: 'Health insurance, 401k'
                                },
                                requiredSkills: {
                                    type: 'array',
                                    items: {
                                        type: 'string'
                                    },
                                    example: ['JavaScript', 'React']
                                },
                                location: {
                                    type: 'string',
                                    required: true,
                                    example: 'New York, NY'
                                },
                                validUntil: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2025-08-21T17:32:28Z'
                                },
                                applicants: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                        format: 'uuid'
                                    },
                                    example: ['5f8d0d55b54764421b7156fb', '5f8d0d55b54764421b7156fd']
                                }
                            },
                            required: ['title', 'location']
                        }
                    }
                }
            },
            responses: {
                "201": {
                    "description": "Job created successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Job created successfully." },
                                    "data": {
                                        "$ref": "#/components/schemas/Jobs"
                                    },
                                    "totalCount": { "type": "integer", "example": 1 }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Insufficient coins or missing required fields.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "error" },
                                    "msg": { "type": "string", "example": "Not enough coins or missing required fields." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized access, no or invalid authentication token provided, or user not allowed to perform this action.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Unauthorized or not allowed!" },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
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
                                    "msg": { "type": "string", "example": "Internal server error." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                }
            }
        },
        get: {
            summary: 'Get all jobs',
            tags: ['Jobs'],
            description: 'Endpoint to retrieve all job listings with optional filtering, sorting, and field selection. Requires authentication.',
            parameters: [
                {
                    in: 'query',
                    name: 'recommended',
                    required: false,
                    schema: {
                        type: 'boolean',
                    },
                    description: 'Filter for recommended jobs.',
                },
                {
                    in: 'query',
                    name: 'salary',
                    required: false,
                    schema: {
                        type: 'number',
                    },
                    description: 'Filter jobs by salary.',
                },
                {
                    in: 'query',
                    name: 'title',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Filter jobs by title with regex search.',
                },
                {
                    in: 'query',
                    name: 'sort',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Sort jobs based on certain fields (e.g., "-createdAt, salary").',
                },
                {
                    in: 'query',
                    name: 'field',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Select specific fields to be returned (e.g., "title, location, salary").',
                },
                {
                    in: 'query',
                    name: 'numericFilters',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Filter based on numeric criteria (e.g., "salary>50000, experience<2"). Not implemented.',
                },
            ],
            responses: {
                "200": {
                    "description": "A list of jobs with optional filtering, sorting, and field selection.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Jobs retrieved successfully." },
                                    "data": {
                                        "type": "array",
                                        "items": {
                                            "$ref": "#/components/schemas/Jobs"
                                        }
                                    },
                                    "totalCount": {
                                        "type": "integer",
                                        "example": 0
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
                                    "totalCount": { "type": "integer", "example": 0 }
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
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/jobs/myJobs': {
        get: {
            summary: 'Get all job posts created by the authenticated employer',
            tags: ['Jobs'],
            description: 'Endpoint to retrieve all job posts created by the authenticated employer. Requires authentication and the user must have the "Employer" role.',
            responses: {
                "200": {
                    "description": "A list of all job posts created by the authenticated employer.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "All job posts retrieved successfully." },
                                    "data": {
                                        "type": "array",
                                        "items": {
                                            "$ref": "#/components/schemas/Jobs"
                                        }
                                    },
                                    "totalCount": {
                                        "type": "integer",
                                        "example": 10
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized access, no or invalid authentication token provided, or user not allowed to perform this action.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Unauthorized access, no or invalid authentication token provided, or not allowed." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
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
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/jobs/{id}': {
        get: {
            summary: 'Get a single job post',
            tags: ['Jobs'],
            description: 'Endpoint to retrieve a single job post by its ID. Requires authentication.',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the job post.',
                }
            ],
            responses: {
                "200": {
                    "description": "Details of the requested job post.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Job post retrieved successfully." },
                                    "data": {
                                        "$ref": "#/components/schemas/Jobs"
                                    },
                                    "totalCount": { "type": "integer", "example": 1 }
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
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Job post not found.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Job post not found." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
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
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                }
            }
        },
        patch: {
            summary: 'Update a job post',
            tags: ['Jobs'],
            description: 'Endpoint to update a job post by its ID. Requires authentication and the user must have the "Employer" role.',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the job post to update.',
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Jobs' // Reference to your Jobs schema for request body
                        }
                    }
                }
            },
            responses: {
                "200": {
                    "description": "Job updated successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Job updated successfully." },
                                    "data": {
                                        "$ref": "#/components/schemas/Jobs" // Incorporate data structure from Jobs schema
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Invalid job ID or job does not exist.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "error" },
                                    "msg": { "type": "string", "example": "Invalid job ID or job does not exist." },
                                    "data": { "type": "null" }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized access, no or invalid authentication token provided, or user not allowed to perform this action.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Unauthorized access, no or invalid authentication token provided, or not allowed." },
                                    "data": { "type": "null" }
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
                                    "data": { "type": "null" }
                                }
                            }
                        }
                    }
                }
            }
        },
        delete: {
            summary: 'Delete a job post',
            tags: ['Jobs'],
            description: 'Endpoint to delete a job post by its ID. Requires authentication and the user must have the "Employer" role.',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the job post to delete.',
                }
            ],
            security: [
                {
                    bearerAuth: [] // assumes you have defined bearerAuth under securitySchemes
                }
            ],
            responses: {
                "200": {
                    "description": "Job deleted successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Job deleted successfully." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized access, no or invalid authentication token provided, or user not allowed to perform this action.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Unauthorized access, no or invalid authentication token provided, or not allowed." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Job post not found or not authorized to delete this job.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Job post not found or not authorized to delete." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
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
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/jobs/{id}/apply': {
        post: {
            summary: 'Apply for a job',
            tags: ['Jobs'],
            description: 'Endpoint for a job seeker to apply for a job by its ID. Requires authentication.',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the job to apply for.',
                }
            ],
            responses: {
                "200": {
                    "description": "Job application submitted successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Job application submitted successfully." },
                                    "data": { "type": "null" }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "User cannot apply for their own job or other client error.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "error" },
                                    "msg": { "type": "string", "example": "You cannot apply for your own job." },
                                    "data": { "type": "null" }
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
                                    "data": { "type": "null" }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Job post not found.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Job not found." },
                                    "data": { "type": "null" }
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
                                    "data": { "type": "null" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/jobs/myJobs/{id}/applicants': {
        get: {
            summary: 'Get applicants for a specific job',
            tags: ['Jobs'],
            description: 'Endpoint to retrieve all applicants for a specific job post by its ID. Requires authentication and the user must have the "Employer" role.',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the job post.',
                }
            ],
            responses: {
                "200": {
                    "description": "List of applicants for the job post.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "List of applicants retrieved successfully." },
                                    "data": {
                                        "type": "array",
                                        "items": {
                                            "$ref": "#/components/schemas/JobSeeker"
                                        }
                                    },
                                    "totalCount": {
                                        "type": "integer",
                                        "example": 0 // Adjust based on actual data; if not applicable, consider omitting or explaining in the documentation.
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized access, no or invalid authentication token provided, or user not allowed to perform this action.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Unauthorized access, no or invalid authentication token provided, or not allowed." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Job post not found or no applicants found for this job.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Job post not found or no applicants found for this job." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
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
                                    "totalCount": { "type": "integer", "example": 0 }
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
    JobsEndpoint
};



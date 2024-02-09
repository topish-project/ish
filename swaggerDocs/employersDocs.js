const EmployersEndpoint = {
    tags: [
        {
            name: 'Employers',
            description: 'The Employers managing API',
        },
    ],
    '/users/getAllEmployers': {
        get: {
            summary: 'Get all employer profiles',
            tags: ['Employers'],
            description: 'Endpoint to retrieve all employer profiles. Requires authentication.',
            responses: {
                "200": {
                    "description": "A list of all employer profiles.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "A list of all employer profiles." },
                                    "data": {
                                        "type": "array",
                                        "items": {
                                            "$ref": "#/components/schemas/Employer"
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
                    "description": "No employer profiles found.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "No employer profiles found." },
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
        },
    },
    '/users/searchEmployers': {
        get: {
            summary: 'Search employers by company name',
            tags: ['Employers'],
            description: 'Endpoint to search for employer profiles by company name. Requires authentication.',
            parameters: [
                {
                    in: 'query',
                    name: 'companyName',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Company name to search for in employer profiles',
                },
            ],
            responses: {
                "200": {
                    "description": "A list of employer profiles that match the company name query.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "A list of employer profiles that match the company name query." },
                                    "data": {
                                        "type": "array",
                                        "items": {
                                            "$ref": "#/components/schemas/Employer"
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
                    "description": "Bad Request - Company name parameter missing or invalid.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "error" },
                                    "msg": { "type": "string", "example": "Please enter a valid company name." },
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
                    "description": "No employers found matching the query.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "No employers found matching the query." },
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
}

module.exports = {
    EmployersEndpoint
};

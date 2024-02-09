const UserAvatarEndpoint = {
    tags: [
        {
            name: 'userAvatar',
            description: 'The User Avatar managing API',
        },
    ],
    '/users/avatar': {
        post: {
            summary: 'Upload avatar',
            tags: ['userAvatar'],
            description: 'Endpoint for a user to upload an avatar. Requires authentication and multipart/form-data for the file upload.',
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                avatar: {
                                    type: 'string',
                                    format: 'binary',
                                    description: 'File to be uploaded as the user avatar.'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    "description": "Avatar uploaded successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Avatar uploaded successfully." },
                                    "data": {
                                        "avatar": {
                                            "type": "string",
                                            "example": "path/to/avatar.jpg",
                                            "description": "The location or key of the uploaded avatar."
                                        }
                                    },
                                    "totalCount": { "type": "integer", "example": 1 }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Bad request, error during file upload or processing.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "error" },
                                    "msg": { "type": "string", "example": "Error message related to file upload." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
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
                                    "msg": { "type": "string", "example": "Unauthorized User!" },
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
                                    "msg": { "type": "string", "example": "Something went wrong." },
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
    '/users/avatar/{id}': {
        get: {
            summary: 'Get avatar of a user',
            tags: ['userAvatar'],
            description: 'Endpoint for retrieving a user\'s avatar. Requires authentication.',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the user whose avatar is being fetched.',
                }
            ],
            responses: {
                "200": {
                    "description": "Avatar fetched successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Avatar fetched successfully." },
                                    "data": {
                                        "type": "string",
                                        "format": "binary",
                                        "example": "data:image/png;base64,...",
                                        "description": "Base64 encoded avatar image."
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
                    "description": "User or avatar not found.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "User or avatar not found." },
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
                                    "msg": { "type": "string", "example": "An error occurred while fetching the avatar." },
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
            summary: 'Update avatar of a user',
            tags: ['userAvatar'],
            description: 'Endpoint for updating a user\'s avatar. Requires authentication and multipart/form-data for the file upload.',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the user whose avatar is being updated.',
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                avatar: {
                                    type: 'string',
                                    format: 'binary',
                                    description: 'File to be uploaded as the new user avatar.'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    "description": "Avatar updated successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Avatar updated successfully." },
                                    "data": {
                                        "avatar": {
                                            "type": "string",
                                            "example": "path/to/new/avatar.jpg",
                                            "description": "The location or key of the updated avatar."
                                        }
                                    },
                                    "totalCount": { "type": "integer", "example": 1 }
                                }
                            }
                        }
                    }
                },
                "400": {
                    "description": "Bad request, error during file upload or processing.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "error" },
                                    "msg": { "type": "string", "example": "Error message related to file upload." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
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
                                    "msg": { "type": "string", "example": "Something went wrong." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
                                }
                            }
                        }
                    }
                }
            }
        },
        delete: {
            summary: 'Delete avatar of a user',
            tags: ['userAvatar'],
            description: 'Endpoint for deleting a user\'s avatar. Requires authentication.',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the user whose avatar is being deleted.',
                }
            ],
            responses: {
                "200": {
                    "description": "Avatar deleted successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Avatar deleted successfully." },
                                    "data": { "type": "null" },
                                    "totalCount": { "type": "integer", "example": 0 }
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
                    "description": "Avatar not found.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Avatar not found." },
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
                                    "msg": { "type": "string", "example": "Something went wrong." },
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
}

module.exports = {
    UserAvatarEndpoint
}



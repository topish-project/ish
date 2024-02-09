const MessagesEndpoint = {
    tags: [
        {
            name: 'Messages',
            description: 'The messages managing API',
        },
    ],
    '/users/messaging/messages/sendMessage': {
        post: {
            summary: 'Send a message',
            tags: ['Messages'],
            description: 'Endpoint for sending a message to a recipient. Requires authentication and the sender and recipient IDs.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['text', 'sender', 'recipient'],
                            properties: {
                                text: {
                                    type: 'string',
                                    description: 'The text content of the message.'
                                },
                                sender: {
                                    type: 'string',
                                    format: 'uuid',
                                    description: 'The unique identifier of the sender.'
                                },
                                recipient: {
                                    type: 'string',
                                    format: 'uuid',
                                    description: 'The unique identifier of the recipient.'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "201": {
                    "description": "Message sent successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Message sent successfully." },
                                    "data": {
                                        "message": {
                                            "$ref": "#/components/schemas/Message"
                                        }
                                    },
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
                                    "msg": { "type": "string", "example": "Something went wrong during the message sending process." },
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
    '/users/messaging/chat/{chatRoomId}': {
        get: {
            summary: 'Get a chat room by ID',
            tags: ['Messages'],
            description: 'Endpoint for retrieving a chat room by ID along with its message history. Requires authentication.',
            parameters: [
                {
                    in: 'path',
                    name: 'chatRoomId',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the chat room.',
                }
            ],
            responses: {
                "200": {
                    "description": "Chat room and message history retrieved successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Chat room and message history retrieved successfully." },
                                    "data": {
                                        "chatRoom": {
                                            "$ref": "#/components/schemas/ChatRoom"
                                        },
                                        "messageHistory": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/Message"
                                            }
                                        }
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
                                    "data": { "type": "null" }
                                }
                            }
                        }
                    }
                },
                "404": {
                    "description": "Chat room not found.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Chat room not found." },
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
                                    "msg": { "type": "string", "example": "Something went wrong." },
                                    "data": { "type": "null" }
                                }
                            }
                        }
                    }
                }
            }
        },
        delete: {
            summary: 'Delete a chat room',
            tags: ['Messages'],
            description: 'Endpoint for deleting a chat room by ID. Requires authentication. Also marks all messages within the chat room as deleted.',
            parameters: [
                {
                    in: 'path',
                    name: 'chatRoomId',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'The unique identifier of the chat room to be deleted.',
                }
            ],
            responses: {
                "200": {
                    "description": "Chat room deleted successfully.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "success" },
                                    "msg": { "type": "string", "example": "Chat room deleted successfully." },
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
                    "description": "Chat room not found.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "result": { "type": "string", "example": "failure" },
                                    "msg": { "type": "string", "example": "Chat room not found." },
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
    }

}




module.exports = {
    MessagesEndpoint
}





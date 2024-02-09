const JobSeekerSchema = {
    JobSeeker: {
        type: 'object',
        properties: {
            fullName: {
                type: 'string',
                example: 'User 650798'
            },
            gender: {
                type: 'string',
                example: 'Choose'
            },
            skills: {
                type: 'array',
                items: {
                    type: 'string'
                },
                example: []
            },
            isVerified: {
                type: 'boolean',
                example: false
            },
            currentLocation: {
                type: 'string',
                example: 'Toshkent'
            },
            _id: {
                type: 'string',
                example: '65af1bd9754929656269be12'
            }
        }
    }
};
const EmployerSchema = {
    Employer: {
        type: 'object',
        properties: {
            companyName: {
                type: 'string',
                example: 'Example Company Inc.'
            },
            industry: {
                type: 'string',
                example: 'Technology'
            },
            location: {
                type: 'string',
                example: 'Silicon Valley'
            },
            isVerified: {
                type: 'boolean',
                example: false
            },
            contactEmail: {
                type: 'string',
                format: 'email',
                example: 'contact@examplecompany.com'
            },
            _id: {
                type: 'string',
                example: '65af1bd9754929656269be89'
            }
            // You can add more properties specific to employers here
        }
    }
};
const UserSchema = {
    Users: {
        type: 'object',
        properties: {
            phoneNumber: {
                type: 'number',
                description: 'Unique phone number of the user',
                example: 935553333,
            },
            email: {
                type: 'string',
                format: 'email',
                description: 'Unique email address of the user',
                example: 'user@example.com',
            },
            phoneConfirmed: {
                type: 'boolean',
                default: false,
                description: 'Indicates if the phone number is confirmed',
            },
            emailConfirmed: {
                type: 'boolean',
                default: false,
                description: 'Indicates if the email is confirmed',
            },
            accountVisibility: {
                type: 'boolean',
                default: false,
                description: "User's account visibility status",
            },
            lastSeen: {
                type: 'string',
                format: 'date-time',
                description: 'The last date and time the user was seen',
            },
            role: {
                type: 'string',
                enum: ['JobSeeker', 'Employer'],
                description: 'The role of the user in the system',
            },
            password: {
                type: 'string',
                format: 'password',
                description: 'Password of the user (hashed)',
            },
            jobSeeker: {
                $ref: '#/components/schemas/JobSeeker',
                description: "Job seeker's profile information (required if role is 'JobSeeker')",
            },
            employer: {
                $ref: '#/components/schemas/Employer',
                description: "Employer's profile information (required if role is 'Employer')",
            },
            resumeId: {
                type: 'string',
                format: 'uuid',
                description: 'Reference to the resume document of the user (if any)',
            },
            tokens: {
                type: 'array',
                items: {
                    type: 'object',
                },
                description: "Tokens associated with the user's account",
            },
            coins: {
                type: 'number',
                default: 50,
                description: 'Coins available to the user',
            },
            favorites: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'uuid',
                },
                description: 'Array of user IDs that are marked as favorites by this user',
            },
            avatar: {
                type: 'string',
                description: 'URL to the avatar image of the user',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Timestamp of account creation',
            },
        },
    },
};
const JobsSchema = {
    Jobs: {
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
            createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2021-07-21T17:32:28Z'
            },
            validUntil: {
                type: 'string',
                format: 'date-time',
                example: '2021-08-21T17:32:28Z'
            },
            createdBy: {
                type: 'string',
                format: 'uuid',
                description: 'Employer ID who created the job',
                example: '5f8d0d55b54764421b7156fc'
            },
            applicants: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'uuid'
                },
                example: ['5f8d0d55b54764421b7156fb', '5f8d0d55b54764421b7156fd']
            }
        }
    }
};
const ProfileAccessRequestSchema = {
    ProfileAccessRequest: {
        type: 'object',
        properties: {
            requesterId: {
                type: 'string',
                format: 'uuid',
                description: 'The unique identifier of the user who is requesting access.',
                example: '5f8d0d55b54764421b7156fb'
            },
            targetUserId: {
                type: 'string',
                format: 'uuid',
                description: 'The unique identifier of the user whose profile is being accessed.',
                example: '5f8d0d55b54764421b7156fc'
            },
            status: {
                type: 'string',
                enum: ['pending', 'accepted', 'rejected'],
                default: 'pending',
                description: 'The status of the profile access request.'
            }
        }
    }
};
const MessageSchema = {
    Message: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                description: 'Unique identifier of the message',
                example: '507f191e810c19729de860ea'
            },
            text: {
                type: 'string',
                description: 'The text content of the message',
                example: 'Hello, how are you?'
            },
            sender: {
                type: 'string',
                description: 'The ID of the sender of the message',
                format: 'uuid',
                example: '507f191e810c19729de860eb'
            },
            recipient: {
                type: 'string',
                description: 'The ID of the recipient of the message',
                format: 'uuid',
                example: '507f191e810c19729de860ec'
            },
            deleted: {
                type: 'boolean',
                description: 'Indicates if the message is deleted',
                example: false
            },
            seen: {
                type: 'boolean',
                description: 'Indicates if the message has been seen by the recipient',
                example: false
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'The time when the message was sent',
                example: '2023-01-01T00:00:00Z'
            }
        }
    }
};

const ChatRoomSchema = {
    ChatRoom: {
        type: 'object',
        properties: {
            _id: {
                type: 'string',
                description: 'Unique identifier of the chat room',
                example: '507f191e810c19729de860ea'
            },
            users: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Array of user IDs who are part of the chat room'
                },
                description: 'The users who are part of the chat room'
            },
            messages: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Array of message IDs that belong to the chat room'
                },
                description: 'The messages that have been sent in the chat room'
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'The time when the chat room was created',
                example: '2023-01-01T00:00:00Z'
            }
        }
    }
};
const resumeSchema = {
    WorkExperience: {
        type: 'object',
        properties: {
            jobTitle: {
                type: 'string',
                description: 'The title of the job position.',
                example: 'Software Developer',
            },
            company: {
                type: 'string',
                description: 'The name of the company where the user worked.',
                example: 'Tech Solutions Inc.',
            },
            startDate: {
                type: 'string',
                format: 'date',
                description: 'The starting date of the work experience.',
                example: '2020-01-01',
            },
            endDate: {
                type: 'string',
                format: 'date',
                description: 'The ending date of the work experience. Can be null if it is the current job.',
                example: '2022-12-31',
            },
            current: {
                type: 'boolean',
                description: 'Indicates if this is the user\'s current job.',
                default: false,
            },
            description: {
                type: 'string',
                description: 'A brief description of the job and responsibilities.',
                example: 'Developed and maintained web applications using JavaScript and Python.',
            },
            employmentType: {
                type: 'string',
                enum: ['Full-time', 'Part-time', 'Self-employed', 'Freelance', 'Contract', 'Internship', 'Apprenticeship', 'Seasonal'],
                description: 'The type of employment.',
            },
            location: {
                type: 'string',
                description: 'The location of the job.',
                example: 'New York, NY',
            },
            id: {
                type: 'string',
                format: 'uuid',
                description: 'A UUID that uniquely identifies this work experience entry.',
            }
        },
    },
    Project: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                example: 'Project Title',
            },
            description: {
                type: 'string',
                example: 'Developed a web application...',
            },
            role: {
                type: 'string',
                example: 'Front-end Developer',
            },
            technologies: {
                type: 'array',
                items: {
                    type: 'string',
                },
                example: ['React', 'Node.js'],
            },
            startDate: {
                type: 'string',
                format: 'date',
                example: '2022-05-01',
            },
            endDate: {
                type: 'string',
                format: 'date',
                example: '2022-07-01',
            },
            current: {
                type: 'boolean',
                example: false,
            },
            link: {
                type: 'string',
                example: 'http://www.example.com',
            },
        },
    },
    Resume: {
        type: 'object',
        properties: {
            about: {
                type: 'string',
                description: 'Brief description about the user',
                example: 'A passionate software developer...',
            },
            industry: {
                type: 'array',
                items: {
                    type: 'string'
                },
                description: 'List of industries the user is interested in or has worked in',
                example: ['Information Technology', 'Finance'],
            },
            contact: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Contact email of the user',
                        example: 'user@example.com',
                    },
                    phone: {
                        type: 'string',
                        description: 'Contact phone number of the user',
                        example: '123-456-7890',
                    },
                    location: {
                        type: 'string',
                        description: 'Location of the user',
                        example: 'New York, NY',
                    },
                },
            },
            workExperience: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/WorkExperience',
                },
                description: 'List of work experiences',
            },
            education: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Education',
                },
                description: 'List of educational backgrounds',
            },
            projects: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Project',
                },
                description: 'List of projects',
            },
            skills: {
                type: 'array',
                items: {
                    type: 'string',
                },
                description: 'List of skills',
                example: ['JavaScript', 'React', 'Node.js'],
            },
        },
    },
};
const AwardSchema = {
    Award: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                description: 'The title of the award or recognition received.',
                example: 'Best Innovator of the Year'
            },
            issuer: {
                type: 'string',
                description: 'The organization or entity that issued the award.',
                example: 'Innovation Institute'
            },
            dateAwarded: {
                type: 'string',
                format: 'date',
                description: 'The date when the award was received.',
                example: '2023-05-12'
            },
            description: {
                type: 'string',
                description: 'A brief description about the award or the criteria for receiving the award.',
                example: 'Awarded for outstanding innovation in technology.'
            },
            id: {
                type: 'string',
                description: 'A unique identifier for the award, used for managing awards in the system.',
                example: '123e4567-e89b-12d3-a456-426614174000'
            }
        }
    }
};
const CertificateSchema = {
    Certificate: {
        type: 'object',
        properties: {
            title: { type: 'string', example: 'Certified Cloud Practitioner' },
            organization: { type: 'string', example: 'Amazon Web Services' },
            dateOfIssue: { type: 'string', format: 'date-time', example: '2020-08-01T00:00:00.000Z' },
            expirationDate: { type: 'string', format: 'date-time', example: '2023-08-01T00:00:00.000Z' },
            notExpire: { type: 'boolean', example: false },
            credentialId: { type: 'string', example: 'AWS-01234567' },
            credentialUrl: { type: 'string', example: 'https://www.yourcertificate.com' },
            id: { type: 'string', example: '4fbebbb9-7283-4929-8354-b01c06256dab' }
        }
    }
};
const summarySchema = {
    Summary: {
        type: 'object',
        properties: {
            summary: {
                type: 'string',
                description: 'A brief summary or introduction about the user.',
                example: 'Experienced web developer with a strong background in developing award-winning applications for a diverse clientele.',
            },
        },
        required: ['summary'],
    },
};
const EducationExperienceSchema = {
    EducationExperience: {
        type: 'object',
        properties: {
            school: {
                type: 'string',
                description: 'Name of the school or institution.',
                example: 'Harvard University',
            },
            degree: {
                type: 'string',
                description: 'Degree or certification obtained.',
                example: 'Bachelor of Science',
            },
            fieldOfStudy: {
                type: 'string',
                description: 'Field of study or major.',
                example: 'Computer Science',
            },
            startDate: {
                type: 'string',
                format: 'date',
                description: 'The starting date of the education program.',
                example: '2018-09-01',
            },
            endDate: {
                type: 'string',
                format: 'date',
                description: 'The ending date of the education program. Can be null if it is the current program.',
                example: '2022-05-31',
            },
            graduated: {
                type: 'boolean',
                description: 'Indicates if this is the user\'s current education program.',
                default: false,
            },
            description: {
                type: 'string',
                description: 'A brief description of the program, achievements, or responsibilities.',
                example: 'Graduated with honors.',
            }
        },
        required: ['school', 'degree', 'fieldOfStudy', 'startDate'],
    },
};
const ContactSchema = {
    Contact: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'Email address of the user.',
                example: 'user@example.com',
            },
            phone: {
                type: 'string',
                description: 'Phone number of the user.',
                example: '1234567890',
            },

        },
        required: ['email', 'phone'],
    },
};
const LanguageSchema = {
    Language: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'UUID of the language entry',
                example: "5b919819-06ce-4699-bec4-7bf66f123926",
            },
            language: {
                type: 'string',
                description: 'Name of the language',
                example: 'English',
            },
            proficiency: {
                type: 'string',
                description: 'Proficiency level in the language',
                example: 'Fluent',
            },
        },
    },
}
const skillsSchema = {
    Skills: {
        type: 'object',
        properties: {
            skills: {
                type: 'array',
                items: {
                    type: 'string'
                },
                description: 'An array of skills.',
                example: ["JavaScript", "React", "Node.js"]
            },
        },
    },
};
const CVFileSchema = {
    CVFile: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: 'Unique identifier for the CV file entry',
                example: '123e4567-e89b-12d3-a456-426614174000',
            },
            path: {
                type: 'string',
                description: 'File system path to the CV file',
                example: '/files/cv/123e4567-e89b-12d3-a456-426614174000.pdf',
            },
            filename: {
                type: 'string',
                description: 'Original filename of the CV file',
                example: 'john_doe_cv.pdf',
            },
            size: {
                type: 'number',
                description: 'Size of the CV file in bytes',
                example: 204800,
            }
        },
        required: ['uuid', 'path', 'filename', 'size'],
    },
};


const AllRoutesSchemas = {
    components: {
        schemas: {
            ...UserSchema,
            ...JobSeekerSchema,
            ...EmployerSchema,
            ...JobsSchema,
            ...ProfileAccessRequestSchema,
            ...MessageSchema,
            ...ChatRoomSchema,
            ...resumeSchema,
            ...AwardSchema,
            ...CertificateSchema,
            ...ContactSchema,
            ...summarySchema,
            ...LanguageSchema,
            ...skillsSchema,
            ...CVFileSchema,
            ...EducationExperienceSchema
        }
    }

}

module.exports = { AllRoutesSchemas }


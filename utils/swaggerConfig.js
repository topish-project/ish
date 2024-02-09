// swaggerConfig.js
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { MessagesEndpoint } = require('../swaggerDocs/messagesDocs');
const { UserAvatarEndpoint } = require('../swaggerDocs/userAvatardocs');
const { ProfileEndpoint } = require('../swaggerDocs/profileDocs');
const { JobsEndpoint } = require('../swaggerDocs/jobsDocs');
const { UpdateUser } = require('../swaggerDocs/UpdateUser');
const { FavoriteUser } = require('../swaggerDocs/favoriteUser');
const { UsersEndpoint } = require('../swaggerDocs/userDocs');
const { JobSeekersEndpoint } = require('../swaggerDocs/jobsSeekersDocs');
const { EmployersEndpoint } = require('../swaggerDocs/employersDocs');
const { UserDocResponseSchema, userDocSchema } = require('../swaggerDocs/userResponse');
const { AuthEndpoints } = require('../swaggerDocs/authDocs');
const { AllRoutesSchemas } = require('../swaggerDocs/AllRoutesSchemas');
const { workExperienceEndpoint } = require('../swaggerDocs/workExperienceDocs');
const { educationEndpoint } = require('../swaggerDocs/educationDocs');
const { projectEndpoint } = require('../swaggerDocs/projectsDocs');
const { AwardsEndpoints } = require('../swaggerDocs/awardsDocs');
const { certificatesEndpoint } = require('../swaggerDocs/certificatesDocs');
const { contactEndpoint } = require('../swaggerDocs/ContactDocs');
const { summaryEndpoint } = require('../swaggerDocs/SummaryDocs');
const { languagesEndpoint } = require('../swaggerDocs/languageDocs');
const { skillsEndpoint } = require('../swaggerDocs/skillsDocs');
const { cvFileEndpoints } = require('../swaggerDocs/cvFileDocs');

const SecuritySchemes = {
    cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token'  // name of the cookie
    }
};
const port = process.env.PORT || 5001;
// const URL = `http://localhost:${port}/api/v1/`;
// const URL = `https://50.16.45.57:5001/api/v1/`;
const URL = `https://topish-demo-api.onrender.com/api/v1/`;

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple Express Library API",
        },
        servers: [
            {
                url: URL,
            },
        ],
        tags: [AuthEndpoints.tags, UsersEndpoint.tags],
        components: {
            schemas: {
                ...userDocSchema.schemas,
                ...UserDocResponseSchema,
                ...AllRoutesSchemas.components.schemas
            },
        },
        securitySchemes: {
            ...SecuritySchemes // Include your security schemes here
        },
        paths: {
            ...AuthEndpoints,
            ...UsersEndpoint,
            ...JobSeekersEndpoint,
            ...EmployersEndpoint,
            ...UpdateUser,
            ...FavoriteUser,
            ...JobsEndpoint,
            ...ProfileEndpoint,
            ...UserAvatarEndpoint,
            ...MessagesEndpoint,
            ...workExperienceEndpoint,
            ...educationEndpoint,
            ...projectEndpoint,
            ...AwardsEndpoints,
            ...certificatesEndpoint,
            ...contactEndpoint,
            ...summaryEndpoint,
            ...languagesEndpoint,
            ...skillsEndpoint,
            ...cvFileEndpoints
        },
    },
    apis: ["./routes/*.js"],
};

// Setup Swagger
const swaggerSpecs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
    console.log('Swagger is setup and running');
};

module.exports = setupSwagger;
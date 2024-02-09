const express = require('express');
const router = express.Router();

const {
    addWorkExperience,
    getWorkExperience,
    updateWorkExperience,
    deleteWorkExperience
} = require('../controllers/resumeCTRL/WorkExperience'); // Update with the correct path

const {
    addEducationExperience,
    getEducationExperience,
    updateEducationExperience,
    deleteEducationExperience
} = require('../controllers/resumeCTRL/EducationExperience');

const {
    addProject,
    getProjects,
    updateProject,
    deleteProject
} = require('../controllers/resumeCTRL/ProjectsHistory');

const {
    addCertificate,
    getCertificates,
    updateCertificate,
    deleteCertificate
} = require('../controllers/resumeCTRL/Certificates');

const {
    addAward,
    getAwards,
    updateAward,
    deleteAward
} = require('../controllers/resumeCTRL/Award');
const {
    addContact,
    getContact,
    deleteContact
} = require('../controllers/resumeCTRL/Contact');


const {
    addOrUpdateSummary
} = require('../controllers/resumeCTRL/Summary');
const {
    addAndUpdateCvFile,
    getCvFile,
    // updateCvFile,
    deleteCvFile
} = require('../controllers/resumeCTRL/Cv');


const {
    addOrUpdateSkills
} = require('../controllers/resumeCTRL/Skills');

const {
    addLanguages,
    getLanguages,
    updateLanguages,
    deleteLanguages
} = require('../controllers/resumeCTRL/Languages');
const upload = require('../utils/upload');




router.post('/project', addProject);
router.get('/project', getProjects);
router.put('/project/:id', updateProject);
router.delete('/project/:id', deleteProject);

router.post('/experience', addWorkExperience);
router.get('/experience', getWorkExperience);
router.put('/experience/:id', updateWorkExperience);
router.delete('/experience/:id', deleteWorkExperience);


router.post('/education', addEducationExperience);
router.get('/education', getEducationExperience);
router.put('/education/:id', updateEducationExperience);
router.delete('/education/:id', deleteEducationExperience);

router.post('/certificates', addCertificate);
router.get('/certificates', getCertificates);
router.put('/certificates/:id', updateCertificate);
router.delete('/certificates/:id', deleteCertificate);

router.post('/awards', addAward);
router.get('/awards', getAwards);
router.put('/awards/:id', updateAward);
router.delete('/awards/:id', deleteAward);


router.post('/cv', addAndUpdateCvFile);
router.get('/cv', getCvFile);
router.delete('/cv', deleteCvFile);

router.post('/contact', addContact);
router.get('/contact', getContact);
router.delete('/contact', deleteContact);

router.post('/summary', addOrUpdateSummary);
router.post('/skills', addOrUpdateSkills);


router.post('/languages', addLanguages);
router.get('/languages', getLanguages);
router.put('/languages/:id', updateLanguages);
router.delete('/languages/:id', deleteLanguages);

module.exports = router;

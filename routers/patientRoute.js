const express = require('express');
const { newDoctor } = require('../controllers/doctorController');
const { deletePatient, newPatient, allPatients, patientLogIn } = require('../controllers/patientController');

const patientRouter = express.Router()

patientRouter.route('/patients').post(newPatient);
patientRouter.post('/doctors', newDoctor);
patientRouter.route('/removepatient/:id').delete(deletePatient);
patientRouter.route('/patients').get(allPatients)
patientRouter.route('/patientlogin').post(patientLogIn)

module.exports = patientRouter
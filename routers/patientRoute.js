const express = require('express');
const { newDoctor } = require('../controllers/doctorController');
const { deletePatient, newPatient, allPatients, patientLogIn, patientResetPassword, patientForgotPassword, patientLogOut, singlePatient } = require('../controllers/patientController');

const patientRouter = express.Router()

patientRouter.route('/patients').post(newPatient);
patientRouter.post('/doctors', newDoctor);
patientRouter.route('/removepatient/:id').delete(deletePatient);
patientRouter.route('/patients').get(allPatients)
patientRouter.route('/singlepatient/:id').get(singlePatient)

patientRouter.route('/patientlogin').post(patientLogIn)
patientRouter.route('/patientpasswordreset/:id/:token').post(patientResetPassword)
patientRouter.route('/patientforgotpassword').post(patientForgotPassword);
patientRouter.route('/patientlogout').post(patientLogOut)


module.exports = patientRouter
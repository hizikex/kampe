const express = require('express');
const { messageFromPatient, messageFromDoctor, getMessages, addNewMessage } = require('../controllers/chat');
const { newPatient } = require('../controllers/patientController');
const {newDoctor } = require('../controllers/doctorController');

const Router = express.Router();
Router.post("/chat/:senderId/:recipientId", messageFromPatient);
Router.post("/chat/:senderId/:recipientId/", messageFromDoctor);
Router.get('/chat/:senderId/:recipientId', getMessages)
Router.get('/chat/:id/messages', addNewMessage)


Router.post('/patients', newPatient);
Router.post('/doctors', newDoctor)


module.exports = Router
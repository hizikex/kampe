const express = require('express');
const { messageFromPatient, messageFromDoctor, getMessages, addNewMessage } = require('../controllers/chat');
// const { newPatient } = require('../controllers/patientController');
// const {newDoctor } = require('../controllers/doctorController');

const chatRouter = express.Router();
chatRouter.post("/chat/:senderId/:recipientId", messageFromPatient);
chatRouter.post("/chat/:senderId/:recipientId/", messageFromDoctor);
chatRouter.get('/chat/:senderId/:recipientId', getMessages)
chatRouter.get('/chat/:id/messages', addNewMessage)


module.exports = chatRouter
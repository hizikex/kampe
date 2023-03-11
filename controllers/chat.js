const mongoose = require('mongoose');
const Message = require('../models/patientDoctor').Messages;
const Patient = require('../models/patientDoctor').Patient;
const Doctor = require('../models/patientDoctor').Doctor;

//create a new chat session
exports.messageFromPatient = async (req, res, next) => {
try {
    const senderPat = await Patient.findById(req.params.senderId);
    const senderDoc = await Doctor.findById(req.params.senderId);
    const recieverPat = await Patient.findById(req.params.recipientId);
    const recieverDoc = await Doctor.findById(req.params.recipientId);

    if ( !senderPat && !senderDoc) {
        res.status(404).json({
            error: "Patient or doctor not found"
        })
    } else if(senderPat && recieverDoc){
        const chat = new Message({
            message: req.body.message
        });

        chat.senderP = senderPat;
        chat.recieverD = recieverDoc;

        await chat.save();

        senderPat.sentMessages.push(chat);
        recieverDoc.recievedMessages.push(chat);

        await senderPat.save();
        await recieverDoc.save()

        res.status(200).json({
            message: "Successfully",
            data: chat
        })
    }
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

exports.messageFromDoctor = async (req, res) => {
    try {
        const senderDoc = await Doctor.findById(req.params.senderId);
        const receiverPat = await Patient.findById(req.params.receiverId);
        console.log(senderDoc)
        console.log(receiverPat)

        if (!senderDoc || !receiverPat) {
            res.status(404).json({
                message: "Doctor or Patient is Not Found"
            })
        } else if (senderDoc && receiverPat) {
            const chat = new Message({
                message: req.body.message
            })
             chat.senderD = senderDoc;
             chat.recieverP = receiverPat;

             await chat.save();

             senderDoc.sentMessages.push(chat);
             receiverPat.sentMessages.push(chat);

             await senderDoc.save();
             await receiverPat.save();

             res.status(201).json({
                message: "Message Sent",
                data: chat
             })
         } else {
            res.status(401).json({
                message: "Problem creating message"
            })
         }
    } catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
}

// Add a new message to a chat session
exports.addNewMessage = async (req, res) => {
    try {
        const chat = await Message.findById(req.params.id);
        if (!chat) {
            res.status(404).json({
                error: "Chat session not found"
            })
        } else {
            chat.Message.push({
                message: req.body.message
            })
            await chat.save();
            res.status(200).json({
                message: "Message Added Successfully",
                data: chat
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to add message to chat session",
            error: error.message
        })
    }
}


// Retrieve the chat history for a specific chat session
exports.getMessages = async (req, res, next) => {
try {
    const chat = await Message.findById(req.params.ChatId);

    if (!chat) {
        res.status(404).json({
            message: "Chat session not found"
        })
    } else {
        res.status(200).json({
            message: "getting chat with ID: " + req.params.id,
            data: chat
        })
    }
  } catch (error) {
    res.status(404).json({
        message: error.message
    })
  }
}

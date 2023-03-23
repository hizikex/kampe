const mongoose = require('mongoose');
const Patient = require('../models/patientDoctor').patients;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const newPatientMail = require("../utils/email")
// const Doctor = require('../models/patientDoctor').Doctor;

exports.newPatient = async (req, res) =>{
    try {
        const {
            patientName,
            email,
            password,
            phoneNumber,
            dateOfBirth,
            sex,
            medicalHistory
        } = req.body;

        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, saltPassword);

        const patientData = {
            patientName,
            email,
            password: hashPassword,
            phoneNumber,
            dateOfBirth,
            sex,
            medicalHistory
        }

        const newPatient = new Patient(patientData);

        const patientToken = jwt.sign({
            id: newPatient._id,
            email: newPatient.email,
            password: newPatient.password
        },
        process.env.TOKEN, {
            expiresIn: "1d"
        });

        newPatient.token = patientToken

        await newPatient.save();

        const verifyLink = `${req.protocol}://${req.get("host")}/api/patientVerify/${newPatient._id}`;

        const message = `Thanks for registering on kampe. Please click on this link ${verifyLink} to verify your account`;

        newPatientMail({
            email: newPatient.email,
            subject: "Verification on kampe",
            message
        });
        res.status(201).json({
            message: "New Patient Created Successfully",
            data: newPatient
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

exports.patientLogIn = async (req, res) => {
    try {
        const {email} = req.body;
        const checkEmail = await Patient.findOne({email})
        console.log(checkEmail)
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

exports.allPatients = async (req, res) => {
    try {
        const seeAllPatients = await Patient.find();
        console.log(seeAllPatients)
        if (seeAllPatients) {
            res.status(200).json({
                message: "ALL PATIENTS",
                data: seeAllPatients
            })
        } else {
            res.status(404).json({
                message: "No patient in the database"
            })
        }
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

exports.deletePatient = async (req, res) => {
    try {
        const id = req.params.id;
        const removedPatient = await Patient.findByIdAndDelete(id)
        if (removedPatient) {
            res.status(200).json({
                message: `Patient with ID: ${id} is successfully deleted`
            })
        } else {
            res.status(401).json({
                message: `Patient with ID: ${id} not found`,
                data: removedPatient
            })
        }
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}
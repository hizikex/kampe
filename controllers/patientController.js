const mongoose = require('mongoose');
const Patient = require('../models/patientDoctor').patients;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const newPatientMail = require("../utils/email")
const resetPasswordMail = require("../utils/email")
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
        const checkEmail = await Patient.findOne({email:email})
        console.log(checkEmail)
        if (!checkEmail) 
            res.status(404).json({
                message: "No patient registered with this email"
            })
        const isPassword = await bcrypt.compare(req.body.password, checkEmail.password);
        if (!isPassword)
        res.status(404).json({
            message: "Email or password incorrect"
        })

        const logInToken = jwt.sign({
            id: checkEmail._id,
            email: checkEmail.email,
            password: checkEmail.password
        }, process.env.TOKEN, {
            expiresIn: "1d"
        })

        checkEmail.token = logInToken
        await checkEmail.save()

        const {password, ...others} = checkEmail._doc;

        res.status(201).json({
            message: "Log In Successful",
            data: others
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

exports.patientForgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const emailCheck = await Patient.findOne({email: email});
        if (!emailCheck)
        res.status(404).json({
            message: "Wrong email"
        })

        const myToken = await jwt.sign({
            id: emailCheck._id,
            email: emailCheck.email,
            password: emailCheck.password
        }, process.env.TOKEN, {
            expiresIn: "12h"
        })
        
        const resetPasswordLink = `${req.protocol}://${req.get('host')}/api/${emailCheck._id}/${myToken}`

        const message = `Use this link ${resetPasswordLink} to reset your password`;

        resetPasswordMail({
            email: emailCheck.email,
            subject: "Reset Password on kampe",
            message,
        })

        res.status(202).json({
            message: "A mail has been sent to " + emailCheck.email + " for you reset your password"
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

exports.patientResetPassword = async (req, res) => {
    try {
        const id = req.params.id;
        const {password} = req.body;

        const patientId = await Patient.findById(id);
        console.log(patientId);
        const saltPassword = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, saltPassword)
        if (!patientId) 
        res.status(404).json({
            message: "Patient doesn't exist"
        })
            await Patient.findByIdAndUpdate(patientId._id, 
                {
                    password: hashPassword
                }, {
                    new: true
                })

                res.status(200).json({
                    message: "Password Update Successful"
                })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

exports.patientLogOut = async (req, res) => {
    try {
        const id = req.params.id;
        const { email, password } = req.body;
        const token = await jwt.sign({
            id,
            email,
            password
        }, process.env.JWTDESTROY);

        Patient.token = token;
        res.status(200).json({
            message: "Logging out successful"
        })
    } catch (error) {
        res.status(400).json({
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
                message: "ALL PATIENTS ARE: " + seeAllPatients.length,
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
};

exports.singlePatient = async (req, res) => {
    try {
        const id = req.params.id;
        const onePatient = await Patient.findById(id);
        console.log(onePatient._id)
        if ( !onePatient._id ) {
            res.status(404).json({
                message: `Patient with ${id} does not exist`
            })
        } else {
            res.status(200).json({
                message: "Patient with ID: " + id + " displaying",
                data: onePatient
            })
        }
    } catch (error) {
        res.status()
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
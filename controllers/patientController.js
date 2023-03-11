const mongoose = require('mongoose');
const Patient = require('../models/patientDoctor').patients
const bcrypt = require('bcrypt')
// const Doctor = require('../models/patientDoctor').Doctor;

exports.newPatient = async (req, res) =>{
    try {
        const data = {
            patientName, email, password, phoneNumber, dateOfBirth, sex, medicalHistory
        } = req.body;

        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, saltPassword);

        const patientData = {
            patientname,
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

        
        console.log(createdPatient)
        // await patient.save()
        if (createdPatient.length !== 0) {
            res.status(200).json({
                message: "New createdPatient Created",
                data: createdPatient
            })
        } else {
            res.status(401).json({
                message: "New createdPatient Creation Failed",
                status: "FAILED"
            })
        }
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}


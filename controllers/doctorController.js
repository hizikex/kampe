const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { newPatient } = require('./patientController');
const Doctor = require('../models/patientDoctor').doctors;

exports.newDoctor = async (req, res) =>{
    try {
        const {doctorName, email, password, phoneNumber, sex, licenseNumber, specialties} = req.body;

        const saltedPassword = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, saltedPassword);

        const data = {
            doctorName,
            email,
            password: hashedPassword,
            phoneNumber,
            sex,
            licenseNumber,
            specialties
        }

        const newDoctor = new Doctor(data);

        const doctorToken = jwt.sign({
            id: newDoctor._id,
            email: newDoctor.email,
            password: newDoctor.password
        }, process.env.TOKEN, {
            expiresIn: "1d"
        });

        newDoctor.token = doctorToken;
        await newDoctor.save();

        const verifyLink = `${req.protocol}://${req.get("host")}/api/doctorVerify/${newDoctor._id}`;

        const message = `Thanks for registering on kampe. Please click on this link ${verifyLink} to verify your account`;

        if (newDoctor.length !== 0) {
            res.status(200).json({
                message: "newDoctor successfully Created",
                data: newDoctor
            })
        } else {
            res.status(401).json({
                message: "Doctor Creation Failed",
                status: "FAILED"
            })
        }
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}
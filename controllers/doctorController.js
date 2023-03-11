const mongoose = require('mongoose');
// const patient = require('../models/patientDoctor').Patient
const Doctor = require('../models/patientDoctor').Doctor;

exports.newDoctor = async (req, res) =>{
    try {
        const data = {
            username, email, specialties
        } = req.body;
        const createdDoctor = await Doctor.create(data);
        console.log(createdDoctor)
        // await patient.save()
        if (createdDoctor.length !== 0) {
            res.status(200).json({
                message: "New createdDoctor Created",
                data: createdDoctor
            })
        } else {
            res.status(401).json({
                message: "New createdDoctor Creation Failed",
                status: "FAILED"
            })
        }
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}
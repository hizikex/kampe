const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
      patientName: {
        type: String,
        required: [true, "Name is required"]
      },
      email: {
        type: String,
        unique: true,
        required: [true, "Email is required"]
      },
      password: {
        type: String,
        required: [true, "Password is required"]
      },
      phoneNumber: {
        type: String,
        required: [true, 'Phone Number is required']
    },
    dateOfBirth:{
        type: String,
        required:[true, 'DOB is required']
    },
    sex: {
        type: String,
        required: [true, 'Sex is required']
    },
      medicalHistory: {
        type: String
      },
      token: {
        type: String
      },
      verify: {
        type: String,
        default: false
      },
      appointment: [{
        type: Schema.Types.ObjectId,
        ref: 'appointments'
      }],
      pendingRequest: {
        type: String,
        default:false
    },
      sentMessages: [{
        type: Schema.Types.ObjectId,
        ref: 'messages'
      }],
      recievedMessages: [{
        type: Schema.Types.ObjectId,
        ref: 'messages'
      }],
},{
  timestamps: true
});

const patients = mongoose.model('patients', patientSchema);

const doctorSchema = new Schema({
    doctorName: {
      type: String,
      required: [true, "Name is required"]
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"]
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone Number is required']
    },
    sex: {
      type: String,
      required: [true, 'Sex is required']
    },
    licenseNumber: {
      type: String,
      required: [true]
    },
    specialties: [{
        type: String
    }],
    token: {
      type: String
    },
    verify: {
      type: Boolean,
      default: false
    },
    sentMessages: [{
        type: Schema.Types.ObjectId,
        ref: 'messages'
      }],
      recievedMessages: [{
        type: Schema.Types.ObjectId,
        ref: 'messages'
      }],
      appointment: [{
        type: Schema.Types.ObjectId,
        ref: "appointments"
      }]
},
{
  timestamps: true
});
const doctors = mongoose.model('doctors', doctorSchema);

const messageSchema = new Schema({
  senderP: {
    type: Schema.Types.ObjectId,
    ref: 'patients',
  },
  senderD: {
    type: Schema.Types.ObjectId,
    ref: 'doctors',
  },
  recieverP: {
    type: Schema.Types.ObjectId,
    ref: 'patients',
  },
  recieverD: {
    type: Schema.Types.ObjectId,
    ref: 'doctors',
  },
  message: { type: String,
        required: true,
      },
},{timestamp: true});

const messages = mongoose.model('messages', messageSchema);

const appointmentSchema = new Schema({
  appointmentDate:  {
    type:String,
    },
  appointmentTime:  {
     type:String,
    },
  appointmentStatus: {
     type: Boolean,
     default:false
    },
  symptoms: {
     type: String
    },
  bookAppointment: {
    type: Schema.Types.ObjectId,
    ref: "patients"
    },
    viewAppointmet: {
      type: Schema.Types.ObjectId,
      ref: "doctors"
    }
  }
, {
  timestamps: true
});

const appointments = mongoose.model('appointments', appointmentSchema)

module.exports = {
  patients,
  doctors,
  messages,
  appointments
};


// const chatSchema = new mongoose.Schema({
//   patient: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Patient",
//   },
//   doctor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Doctor",
//   },
//   messages: [
//     {
//       sender: {
//         type: String,
//         required: true,
//       },
//       message: {
//         type: String,
//         required: true,
//       },
//       timestamp: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
// });

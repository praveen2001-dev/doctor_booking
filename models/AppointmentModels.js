import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  requestId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  patientPhone: { 
    type: String, 
    required: true,
  },
  doctorId: { 
    type: String, 
    required: true 
  },
  slotTime: { 
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: "BOOKED"
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

appointmentSchema.index(
  { doctorId: 1, slotTime:1 },
  {unique: true}
)
// 2. Compile into a Model
const Appointment = mongoose.model('appointment', appointmentSchema, "doctor_booking");

export default Appointment;
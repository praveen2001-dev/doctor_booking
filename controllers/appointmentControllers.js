import Appointment from "../models/AppointmentModels.js";

export const bookAppointment = async (req, resp) => {
    try {
        const { requestId, patientPhone, doctorId, slotTime } = req.body;

        // All Field Are Required
        if (!requestId || !patientPhone || !doctorId || !slotTime) {
            return resp.status(400).json({success:false, message: "All fields are required"});
        }

        const slotdate = new Date(slotTime);
        if (isNaN(slotdate)) {
            return resp.status(400).json( {
                success:false, message: "invalid slot time"
            });
        }
        // Check Existing Request
        const existing = await Appointment.findOne({requestId})
        if (existing) {
            const samePayload =
            existing.patientPhone === patientPhone &&
            existing.doctorId === doctorId && 
            new Date(existing.slotTime) === slotdate;

            if (!samePayload) {
                return resp.status(409).json({
                    success:false, message: "Request ID already used with different data"
                })
            }

            return resp.status(200).json({
                success:true, message:"Booking already processed"
            })
        }

        const appointment = await Appointment.create({ requestId, patientPhone, doctorId, slotTime });
        return resp.status(201).json({
            success: true, message:"Appointment booked successfully", data: appointment
        });
    } catch (error) {
        console.log(error.message);
        return resp.status(500).json({
            success:false, message: "Internal Server Error"
        })
    }
}
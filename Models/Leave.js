import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee' 
    },
    leaveType: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    appliedDate: {
        type: Date,
        default: Date.now,
    },
    updatedAt : {
        type: Date,
        default: Date.now,
    },
});

const Leave = mongoose.model('Leave', LeaveSchema);
export default Leave;
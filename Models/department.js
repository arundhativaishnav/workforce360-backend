import mongoose from "mongoose";
const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);
export default Department;
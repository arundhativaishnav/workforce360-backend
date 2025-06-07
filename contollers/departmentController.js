import Department from "../Models/department.js";
import mongoose from "mongoose";
import User from "../Models/User.js";
import Employee from "../Models/Employee.js";
import Leave from "../Models/Leave.js";
import Salary from "../Models/salary.js";
import Attendance from "../Models/Attendence.js";
import Notification from "../Models/Notifications.js";



const getDepartments = async (req, res) => {
        try {
            const departments = await Department.find();
            return res.status(200).json({
                status: "success",
                departments: departments
            })
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "get department  server error",
            })
        }
}
const adddepartment = async (req, res) => {
    try {
        const { departmentName, description } = req.body;
        if (!departmentName || !description) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            });
        }
        const newDepartment = new Department({
            departmentName,
            description,
        });
        await newDepartment.save();
        res.status(201).json({
            success: true,
            message: "Department added successfully",
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
const getDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: "failed",
                message: "Invalid department ID",
            });
        }
        const department = await Department.findById(id);
        
        if (!department) {
            return res.status(404).json({
                status: "failed",
                message: "Department not found",
            });
        }
        return res.status(200).json({
            status: "success",
            department
        })
    

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: "get department  server error",
        })
    }
}
const updateDepartment = async (req, res) => {
    try {
      const { departmentName, description } = req.body;
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
          success: false,
          message: "Invalid department ID",
        });
      }
  
      if (!departmentName || !description) {
        return res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
  
      const department = await Department.findByIdAndUpdate(
        id,
        { departmentName, description },
        { new: true }
      );
  
      if (!department) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Department updated successfully",
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Update department server error",
      });
    }
  };



const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find all employees in the department
    const employees = await Employee.find({ department: id });

    // For each employee, delete related data and employee
    for (const employee of employees) {
      await Leave.deleteMany({ employeeId: employee._id });
      await Salary.deleteMany({ employeeId: employee._id });
      await Attendance.deleteMany({ employeeId: employee.userId });
      await Notification.deleteMany({
        $or: [
          { recipients: employee.userId },
          { readBy: employee.userId }
        ]
      });
      await User.findByIdAndDelete(employee.userId);
      await Employee.findByIdAndDelete(employee._id);
    }

    // Delete the department
    await Department.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Department and related data deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "delete department server error",
    });
  }
};
  
export {adddepartment  , getDepartments , getDepartment , updateDepartment , deleteDepartment}

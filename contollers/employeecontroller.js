import Employee from "../Models/Employee.js";
import User from "../Models/User.js";
import Department from "../Models/department.js";
import bcrypt from "bcrypt";

// ✅ Add Employee
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      phonenumber,
      role
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: req.file?.path || null, // ✅ Cloudinary URL
      phone: phonenumber,
    });

    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    await newEmployee.save();

    return res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Employees
const getEmployees = async (req, res) => {
  try {
    const employee = await Employee.find()
      .populate('userId', 'name email profileImage')
      .populate('department', 'departmentName')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "getemployee server error" });
  }
};

// ✅ Get Employee By ID (for profile page)
const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById(id)
      .populate('userId', 'name email profileImage phone role')
      .populate('department', 'departmentName');

    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate('userId', '-password')
        .populate('department', 'departmentName');
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Failed to fetch employee:", error.message || error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Update Employee
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('userId');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const user = employee.userId;

    // Update user fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phoneNumber || user.phone;
    user.role = req.body.role || user.role;

    // ✅ Hash new password if provided
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }

    // ✅ Update profile image with Cloudinary URL
    if (req.file?.path) {
      user.profileImage = req.file.path;
    }

    await user.save();

    // Update employee fields
    employee.employeeId = req.body.employeeId || employee.employeeId;
    employee.dob = req.body.dob || employee.dob;
    employee.gender = req.body.gender || employee.gender;
    employee.maritalStatus = req.body.maritalStatus || employee.maritalStatus;
    employee.designation = req.body.designation || employee.designation;
    employee.department = req.body.department || employee.department;
    employee.salary = req.body.salary || employee.salary;

    await employee.save();

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('❌ Error updating employee:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ✅ Fetch Employees by Department
const fetchEmployeesByDepId = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const employees = await Employee.find({ department: departmentId });

    return res.status(200).json({
      status: 'success',
      employees,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  fetchEmployeesByDepId,
};

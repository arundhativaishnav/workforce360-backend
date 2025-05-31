import Leave from "../Models/Leave.js"
import Employee from "../Models/Employee.js"
import User from "../Models/User.js"




const AddLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    // ✅ Find the employee document for the user
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // ✅ Use employee._id in leave
    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'Pending',
      appliedDate: new Date()
    });

    await newLeave.save();

    return res.status(201).json({
      success: true,
      message: 'Leave added successfully',
      data: newLeave
    });

  } catch (error) {
    console.error('Error adding leave:', error.message);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getLeaves = async (req, res) => {
  try {
    const { id } = req.params;
   
    let leaves = await Leave.find({ employeeId: id })
    if(!leaves|| leaves.length ===0 ){
      const employee = await Employee.findOne({ userId: id });
      leaves = await Leave.find({ employeeId: employee.id })

    }
    return res.status(200).json({
      success: true,
      leaves
    })
  } catch (error) {
    console.error('Error in getleaves:', error);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while fetching leaves',
      error,
    });
  }
};

const getLeaveforadmin = async (req, res) =>{
     try {
      const leaves = await Leave.find();

const enrichedLeaves = await Promise.all(leaves.map(async (leave) => {
  const employee = await Employee.findById(leave.employeeId).populate('department').populate('userId');
  return {
    _id: leave._id,
    leaveType: leave.leaveType,
    startDate: leave.startDate,
    endDate: leave.endDate,
    reason: leave.reason,
    status: leave.status,
    Name: employee?.userId?.name,
    department: employee?.department?.departmentName,
    employeeId: employee?.employeeId,
  };
}));

res.status(200).json({ success: true, leaves: enrichedLeaves });

      
     } catch (error) {
      console.log(error.message)
      return res.status(500).json({ success: false, message: " get leaves for admin server error "})
      
     }
}

const getLeaveDetail = async (req, res) =>{
      try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    const employee = await Employee.findById(leave.employeeId)
      .populate({ path: 'department', select: 'departmentName' })
      .populate({ path: 'userId', select: 'name profileImage' });

    return res.status(200).json({
      success: true,
      leave: {
        _id: leave._id,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
        status: leave.status,
        Name: employee?.userId?.name,
        profileImage: employee?.userId?.profileImage,
        department: employee?.department?.departmentName,
        employeeId: employee?.employeeId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching leave' });
  }

}

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findByIdAndUpdate(id, { status: req.body.status }, { new: true });

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    return res.status(200).json({ success: true, message: 'Leave updated successfully', leave });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error in updating leave' });
  }
};





export {AddLeave , getLeaves , getLeaveforadmin , getLeaveDetail ,updateLeave};
import Attendance from "../Models/Attendence.js";

// Check-in
export const checkIn = async (req, res) => {
  const employeeId = req.user._id;
  const today = new Date().toISOString().split("T")[0];

  try {
    const existing = await Attendance.findOne({ employeeId, date: today });
    if (existing?.checkInTime) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    await Attendance.findOneAndUpdate(
      { employeeId, date: today },
      { employeeId, date: today, checkInTime: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: "Checked in successfully" });
  } catch (err) {
    res.status(500).json({ message: "Check-in failed", error: err.message });
  }
};

// Check-out
export const checkOut = async (req, res) => {
  const employeeId = req.user._id;
  const today = new Date().toISOString().split("T")[0];

  try {
    const attendance = await Attendance.findOne({ employeeId, date: today });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: "Please check in first" });
    }
    if (attendance.checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    attendance.checkOutTime = new Date();
    await attendance.save();

    res.status(200).json({ success: true, message: "Checked out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Check-out failed", error: err.message });
  }
};
// Get all attendance records (admin view)
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employeeId", "name email")
      .sort({ date: -1 }); // latest first

    res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch attendance", error: err.message });
  }
};

// Filter attendance by date range (optional feature)
export const filterAttendanceByDate = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const filter = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the full end day

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    const records = await Attendance.find(filter)
      .populate("employeeId", "name email")
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Date filter failed",
      error: err.message,
    });
  }
};



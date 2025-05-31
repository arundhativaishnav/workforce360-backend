import Notification from '../Models/Notifications.js';
import User from '../Models/User.js';
import Employee from '../Models/Employee.js';

export const getAllEmployees = async (req, res) => {
  try {
    const employee = await Employee.find().populate('user._id', 'name ').sort({ createdAt: -1 });
        return res.status(200).json({success: true, employee });
        console.log(employee);


  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ success: false, message: 'Error fetching employees' });
  }
};


export const createNotification = async (req, res) => {
  try {
    const { title, message, recipientIds } = req.body;

    let recipients = [];

    if (recipientIds === 'all') {
      const users = await User.find({ role: 'employee' });
      recipients = users.map(user => user._id);
    } else {
      // 🟡 Fix: Ensure recipientIds is an array
      recipients = Array.isArray(recipientIds) ? recipientIds : [];
    }

    const newNotification = new Notification({
      title,
      message,
      recipients,
    });

    await newNotification.save();

    res.status(201).json({ success: true, notification: newNotification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


export const getEmployeeNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({
      $or: [
        { recipients: userId },         // specifically addressed
        { recipients: { $size: 0 } },   // for all (empty array)
      ]
    }).sort({ createdAt: -1 });

    const formatted = notifications.map((notif) => ({
      ...notif._doc,
      read: notif.readBy.includes(userId)
    }));

    res.status(200).json({ success: true, notifications: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });

    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
      await notification.save();
    }

    res.status(200).json({ success: true, message: 'Marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

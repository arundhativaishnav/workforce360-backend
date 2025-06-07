import Notification from '../Models/Notifications.js';
import User from '../Models/User.js';
import Employee from '../Models/Employee.js';
import nodemailer from 'nodemailer';

export const getAllEmployees = async (req, res) => {
  try {
    const employee = await Employee.find().populate('user._id', 'name').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, employee });
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ success: false, message: 'Error fetching employees' });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { title, message, recipientIds } = req.body;

    let users = [];

    if (recipientIds === 'all') {
      users = await User.find({ role: 'employee' });
    } else {
      const ids = Array.isArray(recipientIds) ? recipientIds : [];
      users = await User.find({ _id: { $in: ids } });
    }

    const recipientIdsList = users.map(user => user._id);

    // Save notification
    const newNotification = new Notification({
      title,
      message,
      recipients: recipientIdsList
    });

    await newNotification.save();

    // ✅ Setup email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,    // your Gmail address
        pass: process.env.EMAIL_PASS     // your App Password (NOT Gmail password)
      }
    });

    // ✅ Send email to each employee
    for (let user of users) {
      await transporter.sendMail({
        from: `"Workforce360" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `📢 New Notification: ${title}`,
        html: `<p>Hi ${user.name || 'Employee'},</p><p>${message}</p><p><strong>Regards,</strong><br/>Workforce360 Team</p>`
      });
    }

    res.status(201).json({ success: true, notification: newNotification });
  } catch (err) {
    console.error('Error sending notification/email:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getEmployeeNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({
      $or: [
        { recipients: userId },
        { recipients: { $size: 0 } }
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
    if (!notification)
      return res.status(404).json({ success: false, message: 'Notification not found' });

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

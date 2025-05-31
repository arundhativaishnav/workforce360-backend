import User from "../Models/User.js";
import bcrypt from "bcrypt";

// @desc    Get current admin info
// @route   GET /api/users/me
export const getCurrentUser = async (req, res) => {
 try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log("Fetching user with ID:", req.user.id);
    return res.status(200).json({ success: true, user });

  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ message: 'Server error while fetching user data' });
  }
};

// @desc    Update admin name and email
// @route   PUT /api/users/info
export const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body;

    console.log("Received data:", req.body);
    console.log("File uploaded:", req.file);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (typeof name !== 'undefined') user.name = name;
    if (typeof email !== 'undefined') user.email = email;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

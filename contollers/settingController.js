import Employee from "../Models/Employee.js";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary"; // Cloudinary for image uploads

// ✅ Update Profile (Settings)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword, phoneNumber, role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phone = phoneNumber;
    if (role) user.role = role;

    // Handle password change if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect current password' });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Handle Cloudinary upload for profile image
    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'user_profiles' // Optional folder for image organization
      });
      
      // Save Cloudinary URL to user profile
      user.profileImage = result.secure_url; // Store the secure URL from Cloudinary
    }

    // Save updated user details
    await user.save();
    console.log('User profile updated:', user);

    return res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({ success: false, message: 'Server error while updating profile' });
  }
};

// ✅ Get User Settings (Profile Information)
const getUserSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const userObj = user.toObject();

    // ✅ Append Cloudinary image URL if available
    if (userObj.profileImage) {
      userObj.profileImage = userObj.profileImage; // Use Cloudinary URL directly
    }

    return res.status(200).json({ success: true, user: userObj });
  } catch (err) {
    console.error('Error fetching settings:', err);
    return res.status(500).json({ success: false, message: 'Server error while fetching user data' });
  }
};

export { updateProfile, getUserSettings };

import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    //console.log("auth header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: "Token not provided or invalid format"
      });
    }

    const token = authHeader.split(' ')[1];
    

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        error: "Token not valid"
      });
    }

    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    req.user = user;
    next(); // ✅ Proceed to the controller
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Server side error"
    });
  }
};

export default verifyUser;

import express from 'express';
import { updateProfile, getUserSettings } from '../contollers/settingController.js';
import authmiddleware from '../middleware/authmiddleware.js';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js'; // ✅ Import Cloudinary storage

const upload = multer({ storage }); // ✅ Use Cloudinary storage

const router = express.Router();

router.get('/', authmiddleware, getUserSettings);
router.put('/change-profile', authmiddleware, upload.single('image'), updateProfile);

export default router;

import express from 'express';
import authmiddleware from '../middleware/authmiddleware.js';
import {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  fetchEmployeesByDepId
} from '../contollers/employeecontroller.js';

import multer from 'multer';
import { storage } from '../utils/cloudinary.js'; // ✅ use Cloudinary storage

const upload = multer({ storage }); // ✅ cloudinary config used here

const router = express.Router();

// Routes
router.post('/add', authmiddleware, upload.single('image'), addEmployee);
router.get('/', authmiddleware, getEmployees);
router.get('/:id', authmiddleware, getEmployeeById);
router.put('/update/:id', authmiddleware, upload.single('image'), updateEmployee);
router.get('/department/:id', authmiddleware, fetchEmployeesByDepId);

export default router;

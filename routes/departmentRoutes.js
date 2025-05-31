import express from 'express';
import authmiddleware from '../middleware/authmiddleware.js';
import { adddepartment } from '../contollers/departmentController.js';
import { getDepartments } from '../contollers/departmentController.js';
import { updateDepartment } from '../contollers/departmentController.js';
import { getDepartment } from '../contollers/departmentController.js';
import { deleteDepartment } from '../contollers/departmentController.js';

const router = express.Router();

router.get('/department', authmiddleware, getDepartments);
router.post('/add', authmiddleware, adddepartment);
router.get('/:id', authmiddleware, getDepartment);
router.put('/:id', authmiddleware, updateDepartment);
router.delete('/:id', authmiddleware, deleteDepartment);


export default router;
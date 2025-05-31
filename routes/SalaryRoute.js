import express from 'express';
import authmiddleware from '../middleware/authmiddleware.js';
import {AddSalary} from '../contollers/SalaryController.js';
import {getSalary} from '../contollers/SalaryController.js';

const router = express.Router();

router.post('/add', authmiddleware,AddSalary);
router.get('/:id', authmiddleware,getSalary);

export default router;

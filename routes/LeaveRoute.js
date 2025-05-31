import express from 'express';
import authmiddleware from '../middleware/authmiddleware.js';
import {AddLeave ,getLeaves , getLeaveforadmin , getLeaveDetail ,updateLeave} from '../contollers/LeaveController.js';


const router = express.Router();

router.post('/add', authmiddleware, AddLeave);
router.get('/:id', authmiddleware,getLeaves);
router.put('/:id', authmiddleware,updateLeave);
router.get ('/detail/:id', authmiddleware,getLeaveDetail);
router.get ('/', authmiddleware,getLeaveforadmin);

export default router;

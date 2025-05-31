import Express from 'express';
import authmiddleware from '../middleware/authmiddleware.js';
import {getsummary} from '../contollers/dashboardController.js'


const router = Express.Router();

router.get('/summary' ,authmiddleware , getsummary )

export default router;

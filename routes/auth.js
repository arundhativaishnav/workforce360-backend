import express from 'express';
import { Login , verify } from '../contollers/authcontroller.js';
import authmiddleware from '../middleware/authmiddleware.js';

const router = express.Router()

router.post('/Login', Login)
router.get('/verify', authmiddleware,verify)

export default router;


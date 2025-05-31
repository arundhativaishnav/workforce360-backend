import express from 'express';
import { createNotification, getEmployeeNotifications, markNotificationAsRead , getAllEmployees } from '../contollers/NotificationController.js';
import isAuthenticated from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/', isAuthenticated, createNotification);
router.get('/', isAuthenticated, getAllEmployees);
router.get('/employee', isAuthenticated, getEmployeeNotifications);
router.put('/mark-read/:id', isAuthenticated, markNotificationAsRead);

export default router;

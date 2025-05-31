import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import connectToDB from "./config/configdb.js";

import authRouter from './routes/auth.js';
import departmentRoutes from './routes/departmentRoutes.js';
import employeeRouter from './routes/employee.js';
import SalaryRouter from './routes/SalaryRoute.js';
import LeaveRouter from './routes/LeaveRoute.js';
import settingRouter from './routes/SettingRoute.js';
import DashboardRouter from './routes/DashboardRoute.js';
import AdminSettingRouter from './routes/AdminSettingRoute.js';
import attendanceRoutes from "./routes/attendenceRoute.js";
import NotificationRouter from './routes/NotificationRoute.js';



const app = express();




app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://workforce360-frontend.vercel.app/"
  ],
  credentials: true
}));

app.use(express.json());




// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRoutes);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', SalaryRouter);
app.use('/api/leave', LeaveRouter);
app.use('/api/settings', settingRouter);
app.use('/api/AdminDashboard', DashboardRouter);
app.use('/api/users', AdminSettingRouter);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notifications', NotificationRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

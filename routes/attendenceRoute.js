import express from "express";
import { checkIn, checkOut,getAllAttendance, filterAttendanceByDate  } from "../contollers/AttendenceController.js";
import AuthMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/checkin", AuthMiddleware, checkIn);
router.put("/checkout", AuthMiddleware, checkOut);

router.get("/all",AuthMiddleware , getAllAttendance);
router.get("/filter",AuthMiddleware, filterAttendanceByDate);

export default router;

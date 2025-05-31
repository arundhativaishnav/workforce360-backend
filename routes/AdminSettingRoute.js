import express from "express";
import {
  getCurrentUser,
  updateUserInfo,

} from "../contollers/userController.js";
import authmiddleware from '../middleware/authmiddleware.js'

const router = express.Router();

router.get("/me", authmiddleware, getCurrentUser);
router.put("/info", authmiddleware, updateUserInfo);


export default router;

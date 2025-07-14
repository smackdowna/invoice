import express from "express";
import { forgotPassword, loginUser, logout, registerUser, resetPassword } from "../controllers/userControllers.js";

const router = express.Router();



//register
router.route("/register").post(registerUser);

//login
router.route("/login").post(loginUser);

//forgot password
router.route("/password/forgot").post(forgotPassword);

//reset password
router.route("/password/reset/:token").put(resetPassword);



//logout
router.route("/logout").get(logout);


export default router;

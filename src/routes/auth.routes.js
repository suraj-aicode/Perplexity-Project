import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  verifyEmail,
  login,
  getMe
} from "../controllers/auth.controller.js";
import {
  registerValidation,
  loginValidation,
} from "../validation/auth.validation.js";
import { authUser } from "../middleware/auth.middleware.js";
const authRouter = Router();

/*
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidation, register);

/* 
  * @route GET /api/auth/verify-email
  * @desc Verify user's email
  * @access Public
  * @query { token }
  */

authRouter.get("/verify-email", verifyEmail);

/* 
  * @route POST /api/auth/login
  * @desc Login a user
  * @access Public
  * @body { email, password }
  */
authRouter.post("/login", loginValidation, login);


authRouter.get('/get-me', authUser, getMe)
export default authRouter;

import { Router } from "express";
import { body } from "express-validator";
import { register } from "../controllers/auth.controller.js";
import { registerValidation } from "../validation/auth.validation.js";
const authRouter = Router();

/*
* @route POST /api/auth/register
* @desc Register a new user
* @access Public
* @body { username, email, password }
*/

authRouter.post(
  "/register", registerValidation, register
);

export default authRouter;

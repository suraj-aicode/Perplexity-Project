import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import sendEmail from "../services/mail.service.js";

/* 
  @desc Register a new user
  @route POST /api/auth/register
  @access Public
  @body { username, email, password }
*/

export async function register(req, res) {
  const { username, email, password } = req.body;
  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "Email is already registered",
      success: false,
      err: "User already exists",
    });
  }

  const user = new userModel({
    username,
    email,
    password,
  });

  await user.save();

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `<p>Welcome to Perplexity!</p>
          <p>Thank you for registering, ${username}.</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>`,
    text: `Welcome to Perplexity!\n\nThank you for registering, ${username}.\n\nPlease verify your email by clicking the link below:\n\nhttp://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}`,
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/* 
  @desc Verify user's email
  @route GET /api/auth/verify-email
  @access Public
  @query { token }
*/

export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        err: "User not found",
      });
    }

    user.verified = true;
    await user.save();

    const html = `
      <h1>Email Verified SuccessFully</h1>
      <p>Your email has been verified successfully.</p>
      <a href="http://localhost:3000/login">Go to Login</a>
      `;
    return res.send(html);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
      err: "Invalid or expired token",
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false,
      err: "User not found",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before logging in",
      success: false,
      err: "Email not verified",
    });
  }

  const token = jwt.sign({
    id: user._id,
    username: user.username,
  }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);

  res.status(200).json({
    message: "Login successful",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getMe(req, res) {
  const userId = req.user.id;
  const user = await userModel.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }
  res.status(200).json({
    message: "User found",
    success: true,
    user,
  });
}
export default { register, verifyEmail, login, getMe };

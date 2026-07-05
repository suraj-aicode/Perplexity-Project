import jwt from "jsonwebtoken";


export function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Unauthorized access.",
        success: false,
      err: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
}
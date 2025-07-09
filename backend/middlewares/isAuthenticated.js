import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user ID to request object
    req.id = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
};

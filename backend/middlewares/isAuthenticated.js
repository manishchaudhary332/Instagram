import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: " User not Unauthorized", success:false });
  }


  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if(!decode) {
      return res.status(401).json({ message: "Invalid", success:false });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export default isAuthenticated;
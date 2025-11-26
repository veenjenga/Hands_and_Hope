import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "secretKey";

  try {
    const decoded = jwt.verify(token, secret);
    // Standardize to use `id` property
    req.user = { id: decoded.id || decoded._id, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;

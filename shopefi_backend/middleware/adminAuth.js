const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRETKEY = process.env.ADMINPRIVATEKEY;

const adminAuthMiddleware = (req, res, next) => {
    const token = req.header("token");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRETKEY);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = adminAuthMiddleware;

console.log("Admin authentication middleware is working");

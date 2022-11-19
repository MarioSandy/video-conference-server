const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.user_id = decoded.user_info.user_id;
    req.username = decoded.user_info.username;
    req.email = decoded.user_info.email;
    req.profile_picture = decoded.user_info.profile_picture;
    next();
  });
};

module.exports = verifyJWT;

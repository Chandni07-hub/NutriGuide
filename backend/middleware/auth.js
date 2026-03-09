const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Login required"
    });
  }

  try {

    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token"
    });

  }
};

module.exports = auth;
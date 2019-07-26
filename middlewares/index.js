const jwt = require("jsonwebtoken");

const generateToken = payload => {
  return jwt.sign(payload, "MY SECRET IS MY SECRET, IS IT YOUR SECRET?", {
    expiresIn: "1d"
  });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const decodedToken = jwt.verify(
        token,
        "MY SECRET IS MY SECRET, IS IT YOUR SECRET?"
      );

      req.userId = decodedToken.id;

      next();
    } catch (error) {
      return res
        .status(403)
        .json({ status: "error", message: "Kindly provide valid token" });
    }
  } else {
    return res
      .status(401)
      .json({ status: "error", message: "No token provided" });
  }
};

module.exports = {
  generateToken,
  verifyToken
};

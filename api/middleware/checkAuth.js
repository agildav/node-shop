const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = "";
  //  Bearer token
  req.headers.authorization
    ? (token = req.headers.authorization.split(" ")[1])
    : (token = null);

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } else {
    return res.status(401).json({
      message: "Authentication failed"
    });
  }
};

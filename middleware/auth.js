const jwt = require("jsonwebtoken");
// Model is optional
const isAuth = (req, res, next) => {
  console.log("req.cookies.token", req.cookies.token);
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies.token ||
    req.body.token;

  if (!token) {
    return res.status(403).send("token is missing");
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log("DECODE", decode);
    req.user = decode;
    //bring in info from DB
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = isAuth;

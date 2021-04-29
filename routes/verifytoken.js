const jwt = require("jsonwebtoken");
const User = require("../model/User");
const auth = async (req, res, next) => {
  //const token = req.header('auth-token')
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send("Access denied");
  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    const rootUser = await User.findOne({_id:verified._id,"tokens.token":token})
    if(!rootUser) return res.status(400).send("No User Found");
    req.token=token;
    req.rootUser=rootUser;
    req.userID= rootUser._id;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

module.exports.auth = auth;

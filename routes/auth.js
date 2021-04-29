const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { auth } = require("./verifytoken");

const { registerValidate, loginValidate } = require("../validation");

//Register
router.post("/register", async (req, res) => {
  //check all fields
  const { error } = registerValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check email exists in db
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exist");

  //encrypt password
  const key = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(req.body.password, key);

  //create user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedpassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});


//login
router.post("/login", async (req, res) => {
  //check all fields
  const { error } = loginValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check email exists in db
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not exists");

  //check password match
  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validatePassword) return res.status(400).send("password not matched");

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
  user.tokens = user.tokens.concat({ token: token });
  user.save();

  res
    .cookie("jwt", token, {
      expires: new Date(Date.now() + 60000),
      httpOnly: true,
    })
    .send(token);

  //res.header('auth-token',token).send(token);
});

//logout
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.status(200).send("user logout");
});

module.exports = router;

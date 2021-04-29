const router = require("express").Router();

const { auth } = require("./verifytoken");


router.get("/home", auth, (req, res) => {
  res.send(`welcome ${req.rootUser.name}`);
  
});

module.exports = router;

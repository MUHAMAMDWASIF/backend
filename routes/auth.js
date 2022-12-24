const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const login = require("../middlewear/login");
router.get("/", (req, res) => {
  res.send("hello");
});
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .send({ error: "Please Enter a Unique Value for Email" });
    }
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    User.create({
      name: req.body.name,
      password: hash,
      email: req.body.email,
    })
      .then((user) => {
        const data = {
          user: {
            id: user._id,
          },
        };
        const authtoken = jwt.sign(data, process.env.SECRECT_KEY);
        success = true;
        res.json({ success, authtoken });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          error: "Please Enter a Unique Value for Email",
          message: err.message,
        });
      });
  }
);
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .send({ error: "please try to login with correct credentials  " });
      }
      const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        return res
          .status(400)
          .send({ error: "please try to login with  credentials  " });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, process.env.SECRECT_KEY);
      success = true;
      res.send({ success, authtoken });
    } catch (error) {
      res.json({
        error: "Please Enter a Unique Value for Email",
        message: err.message,
      });
    }
  }
);

router.post("/getuser", login, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;

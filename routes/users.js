const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../models/users");
const restricted = require("../middlewares/index");
/**
 * METHOD: POST
 * ROUTE: /api/auth/login
 * PURPOSE: Login a user
 */
router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    password = String(password)
    const existingUser = await User.getByUsername(username);
    if (existingUser.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const isValidPassword = bcrypt.compareSync(
      password,
      existingUser[0].password
    );

    if (isValidPassword === true) {
        req.session.user = existingUser[0];
      return res.json({
        status: "success",
        message: `Welcome ${existingUser[0].username}, login successful`
      });
    }
    return res
      .status(401)
      .json({ status: "error", message: "Invalid password" });
  } catch (error) { console.log(error)
    return res
      .status(500)
      .json({ status: "error", message: "Error logging in" });
  }
});

/**
 * METHOD: POST
 * ROUTE: /api/auth/register
 * PURPOSE: Register a user
 */
router.post("/register", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username && !password) {
      return res.status(400).json({
        status: "error",
        message: "Username and Password fields are required"
      });
    }

    const existingUser = await User.getByUsername(username);
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ status: "error", message: "Username already taken" });
    }

    password = String(password);
    let hashedPassword = bcrypt.hashSync(password, 12);

    const newUser = await User.insert({ username, password: hashedPassword });

    if (newUser) {
      return res
        .status(201)
        .json({ status: "success", message: "User created successfully" });
    }

    return res.status(500).json({
      status: "error",
      message: "Error registering user"
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error registering user"
    });
  }
});

router.post("/users", restricted, async (req, res) => {
  const users = await User.get();

  return res.status(200).json({ status: "success", data: users });
});

module.exports = router;

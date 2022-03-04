const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const pool = require("../db");

router.post(
  "/",
  [
    check("password", "Please provide a valid password").isLength({
      min: 6,
      max: 20,
    }),
  ],
  async (req, res) => {
    try {
      // 1. destructure req.body
      const { email, password } = req.body;

      // 2. check if user doesnt exist (if not then we throw error)
      const user = await pool.query(
        "SELECT * FROM drc_schema.users WHERE user_email = $1",
        [email]
      );

      // validated result
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      // throw error if user does not exist

      if (user.rows.length == 0) {
        return res.status(401).json("User does not exist");
      }

      // 3. Bcrypt the user password
      const bcryptPassword = await bcrypt.hash(password, 10);

      // 4. Enter the updated user's password inside our database

      const updateUser = await pool.query(
        "UPDATE drc_schema.users SET user_password = $1 WHERE user_email = $2 RETURNING *",
        [bcryptPassword, email]
      );

      res.json(updateUser);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;

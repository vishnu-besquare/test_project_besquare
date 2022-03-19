const pool = require("../db");
const router = require("express").Router();
const authorization = require("../middleware/authorization");

//TOPUP

router.route("/").put(authorization, async (req, res) => {
  const newNumber = req.body.phone_number;
  try {
    const amount = req.body.amount;
    const topup = await pool.query(
      "update drc_schema.users set phone_number=$1 where user_id = $2",
      [newNumber, req.user]
    );

    res.json("Update User Successful");
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;

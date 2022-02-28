const pool = require("../db");
const router = require("express").Router();
const authorization = require("../middleware/authorization");
const math = require("mathjs");

//TOPUP

router.route("/").put(authorization, async (req, res) => {
  try {
    const getBalance = await pool.query(
      "select balance from vishnschema.wallet where user_id=$1",
      [req.user]
    );

    var oldBalance = getBalance.rows[0].balance;

    var newBalance = oldBalance + 500;

    const topup = await pool.query(
      "update vishnschema.wallet set balance=$1 where user_id = $2",
      [newBalance, req.user]
    );

    const epoch = Math.floor(new Date().getTime() / 1000);

    const recordPayment = await pool.query(
      "insert into vishnschema.payment (user_id,payment_type,payment_amount,payment_status,payment_timestamp) values ($1,$2,$3,$4,$5)",
      [req.user, "Topup", 500, "Completed", epoch]
    );

    res.json("Topup Succesful");
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;

const pool = require("../db");
const router = require("express").Router();
const authorization = require("../middleware/authorization");
const math = require("mathjs");

//WITHDRAW

router.route("/").put(authorization, async (req, res) => {
  const withdraw_request = req.body.withdraw_amount;

  try {
    const getBalance = await pool.query(
      "select balance from drc_schema.wallet where user_id=$1",
      [req.user]
    );

    var balance = getBalance.rows[0].balance;

    if (balance >= withdraw_request) {
      var withdraw_amount = balance - withdraw_request;

      const withdraw = await pool.query(
        "update drc_schema.wallet set balance=$1 where user_id = $2",
        [withdraw_amount, req.user]
      );

      const epoch = Math.floor(new Date().getTime() / 1000);

      const recordPayment = await pool.query(
        "insert into drc_schema.payment (user_id,payment_type,payment_amount,payment_status,payment_timestamp) values ($1,$2,$3,$4,$5)",
        [req.user, "Withdraw", withdraw_request, "Completed", epoch]
      );

      res.json("Withdraw Successful");
    } else {
      res.json("Insufficient Balance");
    }
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;

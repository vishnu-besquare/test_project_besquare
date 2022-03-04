const pool = require("../db");
const router = require("express").Router();
const authorization = require("../middleware/authorization");
const WebSocket = require("ws");
const math = require("mathjs");

var data2;

// Get current price

router.route("/Xau").put(authorization, async (req, res) => {
  const amount = req.body.amount;

  try {
    var ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    ws.onopen = function (evt) {
      ws.send(
        JSON.stringify({
          ticks_history: "frxXAUUSD",
          count: 1,
          end: "latest",
        })
      );
    };
    ws.onmessage = async function (msg) {
      var data = await JSON.parse(msg.data);
      data2 = await data.history.prices;
      //   console.log("Current price is", data.history.prices);
      //   console.log(data2);

      ws.close();
      //   console.log("closed");

      var converted = Number(data2);
      var amountEarned = amount * converted;
      amountEarned = Number(amountEarned.toFixed(3));
      //   console.log(goldQuantity);

      const getAmountOwned = await pool.query(
        "select gold_amount from vishnschema.asset where user_id=$1",
        [req.user]
      );
      //   console.log(typeof getbalance.rows[0].balance);
      //   var hello = Number(getbalance);
      //   console.log(hello + 1);

      //   console.log(getbalance.rows[0].balance);

      //   console.log("this is req.amount", amount);
      //   console.log("this is req.users", req.user);

      //Checking if the users has enough money to continue the purchase
      if (getAmountOwned.rows[0].gold_amount >= amount) {
        var newAmountOwned = getAmountOwned.rows[0].gold_amount - amount;
        const updateAmountOwned = await pool.query(
          "update vishnschema.asset set gold_amount=$1 where user_id = $2",
          [newAmountOwned, req.user]
        );

        const epoch = Math.floor(new Date().getTime() / 1000);

        //Code below is to insert the current transaction

        const insertTransaction = await pool.query(
          "insert into vishnschema.transaction (user_id,timestamp,tx_amount,tx_type,tx_asset,tx_asset_amount) values ($1,$2,$3,$4,$5,$6)",
          [req.user, epoch, amountEarned, "sell", "gold", amount * -1]
        );

        const getBalance = await pool.query(
          "select balance from vishnschema.wallet where user_id=$1",
          [req.user]
        );
        // console.log("gold amoiunt user has is", getGold.rows[0].gold_amount);
        //getGold.rows[0].gold_amount;

        // console.log(typeof goldQuantity);
        // console.log(typeof getGold.rows[0].gold_amount);

        var newBalance = amountEarned + getBalance.rows[0].balance;

        // console.log(newGoldAmount);

        //The code below is the update the assets table with the amount of gold

        const updateWallet = await pool.query(
          "update vishnschema.wallet set balance=$1 where user_id=$2",
          [newBalance, req.user]
        );

        res.json("Selling Succesful");
      } else {
        res.json("Not enough gold to sell");
      }
    };
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;

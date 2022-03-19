const pool = require("../db");
const router = require("express").Router();
const authorization = require("../middleware/authorization");
const WebSocket = require("ws");
const math = require("mathjs");

var data2;

//GET BALANCE

router.route("/").get(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());

  //const id = req.params["id"];

  try {
    const getbalance = await pool.query(
      "select balance from drc_schema.wallet where user_id=$1",
      [req.user]
    );

    res.json(getbalance);
  } catch (err) {
    console.error(err.message);
  }
});

// Get current price
//GOLD
router.route("/Xau").put(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());

  //const id = req.params["id"];
  const amount = req.body.buy_amount;

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
      var goldQuantity = amount / converted;
      goldQuantity = Number(goldQuantity.toFixed(3));
      // console.log(goldQuantity);

      const getbalance = await pool.query(
        "select balance from drc_schema.wallet where user_id=$1",
        [req.user]
      );
      //   console.log(typeof getbalance.rows[0].balance);
      //   var hello = Number(getbalance);
      //   console.log(hello + 1);

      //   console.log(getbalance.rows[0].balance);

      //   console.log("this is req.amount", amount);
      //   console.log("this is req.users", req.user);

      //Checking if the users has enough money to continue the purchase
      if (amount > 9) {
        if (getbalance.rows[0].balance >= amount) {
          var newBalance = getbalance.rows[0].balance - amount;
          const updateBalance = await pool.query(
            "update drc_schema.wallet set balance=$1 where user_id = $2",
            [newBalance, req.user]
          );

          const epoch = Math.floor(new Date().getTime() / 1000);

          //Code below is to insert the current transaction

          const insertTransaction = await pool.query(
            "insert into drc_schema.transaction (user_id,timestamp,tx_amount,tx_type,tx_asset,tx_asset_amount) values ($1,$2,$3,$4,$5,$6)",
            [req.user, epoch, amount, "buy", "gold", goldQuantity]
          );

          const getGold = await pool.query(
            "select gold_amount from drc_schema.asset where user_id=$1",
            [req.user]
          );
          // console.log("gold amoiunt user has is", getGold.rows[0].gold_amount);
          getGold.rows[0].gold_amount;

          // console.log(typeof goldQuantity);
          // console.log(typeof getGold.rows[0].gold_amount);

          var newGoldAmount = goldQuantity + getGold.rows[0].gold_amount;

          // console.log(newGoldAmount);

          //The code below is the update the assets table with the amount of gold

          const updateAsset = await pool.query(
            "update drc_schema.asset set gold_amount=$1 where user_id=$2",
            [newGoldAmount, req.user]
          );

          res.json("Purchase Gold Successful");
        } else {
          res.json("Insufficient Balance");
        }
      } else {
        res.json("Invalid Amount to Purchase");
      }
    };
  } catch (err) {
    console.error(err.message);
  }
});

//PALLADIUM

router.route("/Xpd").put(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());

  //const id = req.params["id"];
  const amount = req.body.buy_amount;

  try {
    var ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    ws.onopen = function (evt) {
      ws.send(
        JSON.stringify({
          ticks_history: "frxXPDUSD",
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
      var palladiumQuantity = amount / converted;
      palladiumQuantity = Number(palladiumQuantity.toFixed(3));
      //console.log(palladiumQuantity);

      const getbalance = await pool.query(
        "select balance from drc_schema.wallet where user_id=$1",
        [req.user]
      );
      //   console.log(typeof getbalance.rows[0].balance);
      //   var hello = Number(getbalance);
      //   console.log(hello + 1);

      //   console.log(getbalance.rows[0].balance);

      //   console.log("this is req.amount", amount);
      //   console.log("this is req.users", req.user);

      //Checking if the users has enough money to continue the purchase
      if (amount > 9) {
        if (getbalance.rows[0].balance >= amount) {
          var newBalance = getbalance.rows[0].balance - amount;
          const updateBalance = await pool.query(
            "update drc_schema.wallet set balance=$1 where user_id = $2",
            [newBalance, req.user]
          );

          const epoch = Math.floor(new Date().getTime() / 1000);

          //Code below is to insert the current transaction

          const insertTransaction = await pool.query(
            "insert into drc_schema.transaction (user_id,timestamp,tx_amount,tx_type,tx_asset,tx_asset_amount) values ($1,$2,$3,$4,$5,$6)",
            [req.user, epoch, amount, "buy", "Palladium", palladiumQuantity]
          );

          const getPalladium = await pool.query(
            "select palladium_amount from drc_schema.asset where user_id=$1",
            [req.user]
          );
          // console.log("gold amoiunt user has is", getGold.rows[0].gold_amount);

          // console.log(typeof goldQuantity);
          // console.log(typeof getGold.rows[0].gold_amount);

          var newPalladiumAmount =
            palladiumQuantity + getPalladium.rows[0].palladium_amount;

          //console.log(newPalladiumAmount);

          //The code below is the update the assets table with the amount of gold

          const updateAsset = await pool.query(
            "update drc_schema.asset set palladium_amount=$1 where user_id=$2",
            [newPalladiumAmount, req.user]
          );

          res.json("Purchase Palladium Successful");
        } else {
          res.json("Insufficient Balance");
        }
      } else {
        res.json("Invalid Amount to Purchase");
      }
    };
  } catch (err) {
    console.error(err.message);
  }
});

//PLATINUM

router.route("/Xpt").put(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());

  //const id = req.params["id"];
  const amount = req.body.buy_amount;

  try {
    var ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    ws.onopen = function (evt) {
      ws.send(
        JSON.stringify({
          ticks_history: "frxXPTUSD",
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
      var platinumQuantity = amount / converted;
      platinumQuantity = Number(platinumQuantity.toFixed(3));
      //console.log(platinumQuantity);

      const getbalance = await pool.query(
        "select balance from drc_schema.wallet where user_id=$1",
        [req.user]
      );
      //   console.log(typeof getbalance.rows[0].balance);
      //   var hello = Number(getbalance);
      //   console.log(hello + 1);

      //   console.log(getbalance.rows[0].balance);

      //   console.log("this is req.amount", amount);
      //   console.log("this is req.users", req.user);

      //Checking if the users has enough money to continue the purchase
      if (amount > 9) {
        if (getbalance.rows[0].balance >= amount) {
          var newBalance = getbalance.rows[0].balance - amount;
          const updateBalance = await pool.query(
            "update drc_schema.wallet set balance=$1 where user_id = $2",
            [newBalance, req.user]
          );

          const epoch = Math.floor(new Date().getTime() / 1000);

          //Code below is to insert the current transaction

          const insertTransaction = await pool.query(
            "insert into drc_schema.transaction (user_id,timestamp,tx_amount,tx_type,tx_asset,tx_asset_amount) values ($1,$2,$3,$4,$5,$6)",
            [req.user, epoch, amount, "buy", "platinum", platinumQuantity]
          );

          const getPlatinum = await pool.query(
            "select platinum_amount from drc_schema.asset where user_id=$1",
            [req.user]
          );
          // console.log("gold amoiunt user has is", getGold.rows[0].gold_amount);

          // console.log(typeof goldQuantity);
          // console.log(typeof getGold.rows[0].gold_amount);

          var newPlatinumAmount =
            platinumQuantity + getPlatinum.rows[0].platinum_amount;

          //console.log(newPlatinumAmount);

          //The code below is the update the assets table with the amount of gold

          const updateAsset = await pool.query(
            "update drc_schema.asset set platinum_amount=$1 where user_id=$2",
            [newPlatinumAmount, req.user]
          );

          res.json("Purchase Platinum Successful");
        } else {
          res.json("Insufficient Balance");
        }
      } else {
        res.json("Invalid Amount to Purchase");
      }
    };
  } catch (err) {
    console.error(err.message);
  }
});

//SILVER

router.route("/Xag").put(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());

  //const id = req.params["id"];
  const amount = req.body.buy_amount;

  try {
    var ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");
    ws.onopen = function (evt) {
      ws.send(
        JSON.stringify({
          ticks_history: "frxXAGUSD",
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
      var silverQuantity = amount / converted;
      silverQuantity = Number(silverQuantity.toFixed(3));
      //console.log(silverQuantity);

      const getbalance = await pool.query(
        "select balance from drc_schema.wallet where user_id=$1",
        [req.user]
      );
      //   console.log(typeof getbalance.rows[0].balance);
      //   var hello = Number(getbalance);
      //   console.log(hello + 1);

      //   console.log(getbalance.rows[0].balance);

      //   console.log("this is req.amount", amount);
      //   console.log("this is req.users", req.user);

      //Checking if the users has enough money to continue the purchase
      if (amount > 9) {
        if (getbalance.rows[0].balance >= amount) {
          var newBalance = getbalance.rows[0].balance - amount;
          const updateBalance = await pool.query(
            "update drc_schema.wallet set balance=$1 where user_id = $2",
            [newBalance, req.user]
          );

          const epoch = Math.floor(new Date().getTime() / 1000);

          //Code below is to insert the current transaction

          const insertTransaction = await pool.query(
            "insert into drc_schema.transaction (user_id,timestamp,tx_amount,tx_type,tx_asset,tx_asset_amount) values ($1,$2,$3,$4,$5,$6)",
            [req.user, epoch, amount, "buy", "silver", silverQuantity]
          );

          const getSilver = await pool.query(
            "select silver_amount from drc_schema.asset where user_id=$1",
            [req.user]
          );
          // console.log("gold amoiunt user has is", getGold.rows[0].gold_amount);

          // console.log(typeof goldQuantity);
          // console.log(typeof getGold.rows[0].gold_amount);

          var newSilverAmount =
            silverQuantity + getSilver.rows[0].silver_amount;

          //console.log(newSilverAmount);

          //The code below is the update the assets table with the amount of gold

          const updateAsset = await pool.query(
            "update drc_schema.asset set silver_amount=$1 where user_id=$2",
            [newSilverAmount, req.user]
          );

          res.json("Purchase Silver Successful");
        } else {
          res.json("Insufficient Balance");
        }
      } else {
        res.json("Invalid Amount to Purchase");
      }
    };
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;

const pool = require("../db");
const router = require("express").Router();
const authorization = require("../middleware/authorization");
const WebSocket = require("ws");
const math = require("mathjs");

var data2;

//GET BALANCE

router.route("/balance").get(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());

  //const id = req.params["id"];

  try {
    const getbalance = await pool.query(
      "select balance from vishnschema.wallet where user_id=$1",
      [req.user]
    );

    res.json(getbalance.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get transaction table

router.route("/transaction").get(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());

  //const id = req.params["id"];

  try {
    const getTransactionTable = await pool.query(
      "select * from vishnschema.transaction where user_id=$1",
      [req.user]
    );

    res.json(getTransactionTable.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get payment table
router.route("/payment").get(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());

  //const id = req.params["id"];

  try {
    const getPaymentTable = await pool.query(
      "select * from vishnschema.payment where user_id=$1",
      [req.user]
    );

    res.json(getPaymentTable.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get user table
router.route("/user").get(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());

  //const id = req.params["id"];

  try {
    const getUserTable = await pool.query(
      "select * from vishnschema.users where user_id=$1",
      [req.user]
    );

    res.json(getUserTable.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//Get asset table
router.route("/asset").get(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());

  //const id = req.params["id"];

  try {
    const getAssetTable = await pool.query(
      "select * from vishnschema.asset where user_id=$1",
      [req.user]
    );

    res.json(getAssetTable.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get current price

module.exports = router;

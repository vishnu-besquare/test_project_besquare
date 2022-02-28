const pool = require("../db");

const router = require("express").Router();

const authorization = require("../middleware/authorization");

var ticks;
var num;

// function between(min, max) {
//   return Math.floor(Math.random() * max) + min;
// }

// Gets all users

router.route("/").get(async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());
  try {
    const getuser = await pool.query("select * from vishnschema.users");

    res.json(getuser);
  } catch (err) {
    console.error(err.message);
  }
});

//Gets specific users

router.route("/:id").get(authorization, async (req, res) => {
  // res.status(200);
  // res.send(Math.floor(Math.random() * 100 + 1).toString());
  const id = req.params["id"];
  console.log(req.user);
  try {
    const getuser2 = await pool.query(
      "select * from vishnschema.users where userid=$1",
      [id]
    );
    res.json(getuser2);
  } catch (err) {
    console.error(err.message);
  }
});

//Add new users

router.route("/add").post(async (req, res) => {
  try {
    const userid = req.body.userid;
    const username = req.body.username;
    const password = req.body.password;
    const walletbalance = req.body.wallet_balance;

    const newuser = await pool.query(
      "insert into vishnschema.users (userID,username,password,wallet_balance) values ($1,$2,$3,$4) returning *",
      [userid, username, password, walletbalance]
    );

    res.json(newuser);
  } catch (error) {
    console.log("hello");
    console.error(error.message);
  }
});

//Edits user wallet balance

router.route("/edit/:id").put(async (req, res) => {
  try {
    const id = req.params["id"];
    const walletbalance = req.body.wallet_balance;

    const update = await pool.query(
      "update vishnschema.users set wallet_balance=$1 where userid = $2 returning *",
      [walletbalance, id]
    );

    res.send(update);
  } catch (error) {
    console.log("hello");
    console.error(error.message);
  }
});

//Delete Users

router.route("/delete/:id").delete(async (req, res) => {
  try {
    const id = req.params["id"];
    const deleteuser = await pool.query(
      "delete from vishnschema.users where userid=$1",
      [id]
    );

    res.json("Users Deleted");
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;

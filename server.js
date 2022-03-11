const express = require("express");
const cors = require("cors");
const pool = require("./db");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const exercisesRouter = require("./routes/exercise");
const usersRouter = require("./routes/user");
const buyRouter = require("./routes/buy");
const jwt = require("./routes/jwtAuth");
const withdraw = require("./routes/withdraw");
const topup = require("./routes/topup");
const sellRouter = require("./routes/sell");
const resetPassword = require("./routes/resetPassword");
const display = require("./routes/display");
const updateNumber = require("./routes/updateNumber");

app.use("/exercises", exercisesRouter);
app.use("/users", usersRouter);
app.use("/buy", buyRouter);
app.use("/user", jwt);
app.use("/withdraw", withdraw);
app.use("/topup", topup);
app.use("/sell", sellRouter);
app.use("/resetPassword", resetPassword);
app.use("/display", display);
app.use("/updateUser", updateNumber);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

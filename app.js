require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { createUser, loginUser } = require("./controllers/users");
const errorHandler = require("./middleware/centralizedError");
const { validateLogin, validateUserInfo } = require("./middleware/validation");
const { requestLogger, errorLogger } = require("./middleware/logger");

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.post("/signin", validateLogin, loginUser);
app.post("/signup", validateUserInfo, createUser);
app.use(mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`welcome to the entry point ${PORT}`);
});

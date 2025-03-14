const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const mainRouter = require('./routes/index');
const { createUser, loginUser } = require("./controllers/users");
const errorHandler = require("./middleware/centralizedError");

const { PORT = 3001 } = process.env;
const app = express();


app.use(express.json());
app.use(cors());
app.post('/signin', loginUser);
app.post('/signup', createUser);
app.use(mainRouter);
app.use(errorHandler);



mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log("connected to DB");
  }).catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`welcome to the entry point ${PORT}`);
});
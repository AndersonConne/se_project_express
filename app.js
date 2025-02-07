const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');

const { PORT = 3001 } = process.env;
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '67a5768054488721771ee72e'
  };
  next();
});

app.use(express.json());
app.use(mainRouter);



mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log("connected to DB");
  }).catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`welcome to the entry point ${PORT}`);
});
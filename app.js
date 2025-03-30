const express = require('express');
const routes = require('./routes/routes');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')


mongoose.Promise = global.Promise

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/muber')
}

app.use(bodyParser.json()); //must call this before routes
routes(app);

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message })

})

module.exports = app;
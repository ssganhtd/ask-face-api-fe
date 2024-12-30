var express = require('express');
const app = express();

app.use('/event', require('./event'))
app.use('/face', require('./face'))
module.exports = app;
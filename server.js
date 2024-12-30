const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const logger = require('morgan');
require('dotenv').config()

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

const methods = require('./app/helpers/methods')
global.getCollection = methods.getCollection

const db = require("./app/models");
global.db = db
global.APP_DIR = __dirname

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dburl = process.env.DB_URI
db.mongoose.set('strictQuery', true);
db.mongoose
    .connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Đã kết nối tới database");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// routes



app.use('/api', require('./app/routes'));
app.use("/storage", express.static('storage'));

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.use(logger('dev'));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
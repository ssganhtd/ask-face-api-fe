const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");

function getUserIdLogin(req) {
    let token = req.headers['x-access-token'];
    const user = jwt.verify(token, config.secret);
    var userId = user.id
    return userId;
}

function randomCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

let userHelper = {
    getUserIdLogin,
    randomCode
}

module.exports = { userHelper }
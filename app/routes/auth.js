const express = require('express');
const app = express();

app.post("/login", async function (req, res) {
  
  return res.json({ success: true })
})

app.get("/user", async function (req, res) {

  return res.json({ success: true })
})

app.get("/logout", async function (req, res) {

  return res.json({ success: true })
})

module.exports = app;

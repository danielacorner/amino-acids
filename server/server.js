const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const { readFromFile } = require("./utils/fsUtils");

app.use(express.static(`main`));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/protein", async function (req, res) {
  readFromFile("../data/proteins/3j3q.xml", (proteinData) => {
    console.log("🌟🚨 ~ proteinData", proteinData);
    res.json(proteinData);
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("server listening on port " + (process.env.PORT || 8080));
});

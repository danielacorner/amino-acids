const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const fs = require("fs");

const { FILTER_LEVEL, filterByMediaType } = require("./utils");

const getTimeline = require("./functions/getTimeline");

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
  const protein = await openFile();

  res.json(tweets);
});

function openFile(filePath, numTweets, err) {
  if (err) console.log(err); // if no file found, keep going

  console.log(`opening file ${filePath}`);
  fs.open(filePath, "w", (err, fileDirNum) =>
    streamTweets(err, fileDirNum, numTweets)
  );
}

app.listen(process.env.PORT || 8080, () => {
  console.log("server listening on port " + (process.env.PORT || 8080));
});

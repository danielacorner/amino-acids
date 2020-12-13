const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

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
  // readFromFile("../data/proteins/3j3q.xml", (proteinData) => {
  //   console.log("🌟🚨 ~ proteinData", proteinData);
  //   res.json(proteinData);
  // });

  const shapes = [
    {
      id: 1,
      x: 100,
      y: 100,
      z: 100,
    },
    {
      id: 2,
      x: 200,
      y: 200,
      z: 200,
    },
    {
      id: 3,
      x: 200,
      y: 300,
      z: 200,
    },
  ];

  res.json(shapes);
});

app.listen(process.env.PORT || 8080, () => {
  console.log("server listening on port " + (process.env.PORT || 8080));
});

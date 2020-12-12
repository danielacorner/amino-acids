const fs = require("fs");

function handleErr(err) {
  if (err) throw err;
}

function deleteFile(filePath, cb) {
  return fs.unlink(filePath, cb);
}

// once deleted, open "./tweets.json" file
function openFile(filePath, cb) {
  console.log(`opening file ${filePath}`);
  fs.open(filePath, "w", cb);
}

function writeToFile(fileDirNum, tweetWithBracket, cb) {
  fs.write(fileDirNum, tweetWithBracket, null, "utf8", cb);
}

function readFromFile(path, cb) {
  fs.readFile(path, "utf8", function (err, data) {
    handleErr(err);
    console.log("🌟🚨 ~ data", data);
    cb(data);
  });
}
module.exports = {
  handleErr,
  deleteFile,
  openFile,
  writeToFile,
  readFromFile,
};

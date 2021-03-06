module.exports = { generateNewTweetsDataset, addSentimentToTweet };
const { stream, sentiment } = require("../utils");

const fs = require("fs");
const {
  deleteFile,
  handleErr,
  openFile,
  writeToFile,
} = require("../utils/fsUtils");

let count = 0;
let bytes = 0;

function generateNewTweetsDataset({ numTweets, filePath }) {
  console.log("The bot is starting 👋");

  // delete "./tweets.json" file
  console.log(`deleting file`);
  deleteFile(filePath, (err) => {
    handleErr(err);
    console.log(`opening file`);
    openFile(filePath, (err, fileDirNum) => {
      handleErr(err);
      console.log(`streaming data to file...`);
      streamTweets(fileDirNum, numTweets);
    });
  });
}

// then stream tweets
function streamTweets(fileDirNum, numTweets) {
  stream.on("tweet", (tweet) =>
    writeTweetOnReceive(tweet, fileDirNum, numTweets)
  );
}

// when we receive a tweet from the stream,
// add some data and write it to the file
function writeTweetOnReceive(tweet, fileDirNum, numTweets) {
  // increment the count
  count++;

  const tweetWithSentiment = addSentimentToTweet(tweet);

  // stringify tweet
  const string = JSON.stringify(tweetWithSentiment);

  // format tweets as an array
  const tweetWithBracket =
    count === 1
      ? `[${string},`
      : count !== numTweets
      ? `${string},`
      : `${string}]`;

  // save to "./tweets.json"
  // https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
  writeToFile(fileDirNum, tweetWithBracket, onWriteToFile);

  // stop eventually
  if (count === numTweets) {
    endStream(fileDirNum);
  }
}

function addSentimentToTweet(tweet) {
  const sentimentResult = sentiment.analyze(
    (tweet.extended_tweet || tweet).full_text
  );

  return { ...tweet, sentimentResult };
}

let prevMb = 0;
function onWriteToFile(err, written, string) {
  bytes = bytes + written;
  const mb = (bytes / 1024 / 1024).toFixed(1);
  if (prevMb !== mb) {
    console.log("🤖: Mb written:", mb);
    prevMb = mb;
  }
  if (err) throw err;
}

function endStream(fd) {
  fs.close(fd, () => {
    console.log("Finished writing to tweets.json");
    process.exit(0);
  });
}

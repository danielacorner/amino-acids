import React from "react";
import ReactWordcloud from "react-wordcloud";
import styled from "styled-components/macro";
import { useNodes, useWordcloudConfig } from "../../providers/store";

const WordcloudStyles = styled.div`
  height: 100%;
  width: 100%;
`;

/** https://www.npmjs.com/package/react-wordcloud  */
const Wordcloud = () => {
  const nodes = useNodes();
  const { minChars, maxChars, minInstances, numAngles } = useWordcloudConfig();

  // grab text from tweet, quoted tweet
  const nodesWithText: {
    id_str: string;
    text: string;
    quotedText?: string;
  }[] = nodes.map((t) => ({
    id_str: t.id,
    text: t.text,
    quotedText: t.quoted_status?.text,
  }));

  const allTextJoined: string = nodesWithText.reduce((acc, cur) => {
    return acc + cur.text + (cur.quotedText || "");
  }, "");

  const allWords = allTextJoined.split(" ");

  // first, convert into an object with keys for each word (so we don't have to do a double-loop search)

  const allWordsObj: { [word: string]: number } = allWords.reduce(
    (acc, word) => {
      return { ...acc, [word]: word in acc ? acc[word] + 1 : 1 };
    },
    {}
  );

  // then, turn the object into an array

  const words: { text: string; value: number }[] = Object.entries(allWordsObj)
    .filter(([word, value]) => {
      const isRightNumChars =
        minChars <= word.length && word.length <= maxChars;
      const isAboveMinInstances = value >= minInstances;

      return isRightNumChars && isAboveMinInstances;
    })
    .map(([word, value]) => ({ text: word, value }));

  // https://codesandbox.io/s/fnk8w?file=/src/index.js:506-523
  // https://react-wordcloud.netlify.app/props
  const options = {
    fontSizes: [20, 80] as [number, number],
    scale: "sqrt" as any,
    rotations: numAngles,
    rotationAngles: [0, 90] as [number, number],
    spiral: "archimedean" as any,
    enableOptimizations: true,
  };
  return (
    <WordcloudStyles>
      <ReactWordcloud {...{ words, options }} />
    </WordcloudStyles>
  );
};

export default Wordcloud;

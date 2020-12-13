import { useSetNodes, useNodes } from "providers/store";
import { BotScore, Tweet } from "types";

export function useFetchBotScoreForTweet() {
  const nodes = useNodes();
  const setNodes = useSetNodes();

  function setBotScoreForTweet(botScore: BotScore, tweet: Tweet) {
    const tweetWithBotScore = { ...tweet, botScore };
    const tweetIndex = nodes.findIndex((t) => t.id === tweet.id);

    setNodes([
      ...nodes.slice(0, tweetIndex),
      tweetWithBotScore,
      ...nodes.slice(tweetIndex + 1),
    ]);
  }

  return async (tweetOrUserNode: Tweet) => {
    if (!tweetOrUserNode) {
      return;
    }
    const nodesByUser = nodes.filter(
      (t) => t.user.id === tweetOrUserNode.user.id
    );
    const resp = await fetch("/api/generate_bot_score", {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(nodesByUser.slice(0, 10)),
    });
    const botScore = await resp.json();
    setBotScoreForTweet(botScore, tweetOrUserNode);
  };
}

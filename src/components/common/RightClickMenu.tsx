import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import {
  useFetchLikes,
  useFetchTimeline,
  useFetchRetweets,
} from "../../utils/hooks";
import {
  useConfig,
  useSetNodes,
  useTooltipNode,
  useNodes,
} from "providers/store";
import RetweetedIcon from "@material-ui/icons/CachedRounded";
import { useFetchBotScoreForTweet } from "./useFetchBotScoreForTweet";
import { User } from "types";

type RightClickMenuProps = {
  anchorEl: any;
  handleClose: Function;
  isMenuOpen: boolean;
  user?: User;
  MenuProps?: any;
};

// tslint:disable-next-line: cognitive-complexity
export default function RightClickMenu({
  anchorEl,
  handleClose,
  isMenuOpen,
  user,
  MenuProps = {},
}: RightClickMenuProps) {
  const { fetchTimeline } = useFetchTimeline();
  const { setConfig, replace, numTweets } = useConfig();
  const fetchLikes = useFetchLikes();
  const fetchRetweets = useFetchRetweets();
  // TODO: fetch retweeters of a tweet GET statuses/retweeters/ids https://developer.twitter.com/en/docs/twitter-api/v1/nodes/post-and-engage/api-reference/get-statuses-retweets-id
  // TODO: fetch users who liked a tweet
  const tooltipNode = useTooltipNode();
  const isUserNode = tooltipNode?.isUserNode;
  const isTweetNode = !isUserNode;
  const hasRetweet = isTweetNode && tooltipNode?.retweeted_status?.user;

  // send the user's nodes to the Botometer API https://rapidapi.com/OSoMe/api/botometer-pro/endpoints
  const nodes = useNodes();

  const fetchBotScoreForTweet = useFetchBotScoreForTweet();

  const setNodes = useSetNodes();
  const deleteTweetsByUser = () => {
    if (!tooltipNode) {
      return;
    }

    const nodesWithoutThisUser = nodes.filter(
      (t) => t.user.id_str !== tooltipNode.user.id_str
    );

    const prevReplace = replace;
    setConfig({ replace: true });
    setTimeout(() => {
      setNodes(nodesWithoutThisUser, true);
      setConfig({ replace: prevReplace });
    });
    // setTimeout(() => {
    //   setConfig({ replace: false });
    // });
  };
  return (
    <Menu
      {...(anchorEl ? { anchorEl } : {})}
      onBackdropClick={handleClose}
      open={isMenuOpen}
      {...MenuProps}
    >
      <MenuItem
        onClick={() => {
          if (user) {
            fetchTimeline(user.id_str);
          }
          handleClose();
        }}
      >
        Fetch {numTweets} nodes by {tooltipNode?.user.name} (@
        {tooltipNode?.user.screen_name})
      </MenuItem>
      {/* <MenuItem onClick={handleFetchMedia}>Media</MenuItem> */}
      {/* <MenuItem onClick={handleFetchFollowing}>Following</MenuItem> */}
      {/* <MenuItem onClick={handleFetchFollowers}>Followers</MenuItem> */}

      {isUserNode ? (
        <MenuItem
          onClick={() => {
            if (user) {
              fetchLikes(user.id_str);
            }
            handleClose();
          }}
        >
          Fetch {numTweets} nodes liked by {tooltipNode?.user.name} (@
          {tooltipNode?.user.screen_name})
        </MenuItem>
      ) : null}
      {isTweetNode ? (
        <MenuItem
          onClick={() => {
            if (tooltipNode?.id_str) {
              fetchRetweets(tooltipNode?.id_str);
            }
            handleClose();
          }}
        >
          Fetch {numTweets} retweets of this tweet (if any)
        </MenuItem>
      ) : null}
      {hasRetweet ? (
        <MenuItem
          onClick={() => {
            if (tooltipNode?.retweeted_status?.user.id_str) {
              fetchTimeline(tooltipNode?.retweeted_status?.user.id_str);
            }
            handleClose();
          }}
        >
          Fetch {numTweets} nodes by{" "}
          <RetweetedIcon style={{ transform: "scale(0.8)" }} />{" "}
          {tooltipNode?.retweeted_status?.user.name} (@
          {tooltipNode?.retweeted_status?.user.screen_name})
        </MenuItem>
      ) : null}
      {isUserNode ? (
        <MenuItem
          onClick={() => {
            if (tooltipNode) {
              fetchBotScoreForTweet(tooltipNode);
            }
            handleClose();
          }}
        >
          Generate Bot Score for {tooltipNode?.user.name} (@
          {tooltipNode?.user.screen_name})
        </MenuItem>
      ) : null}
      {isUserNode ? (
        <MenuItem
          onClick={() => {
            deleteTweetsByUser();
            handleClose();
          }}
        >
          Delete all nodes by {tooltipNode?.user.name} (@
          {tooltipNode?.user.screen_name})
        </MenuItem>
      ) : null}
    </Menu>
  );
}

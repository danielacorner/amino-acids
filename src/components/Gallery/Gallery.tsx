import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useConfig,
  useNodes,
  useLoading,
  useDeleteTweet,
  usePrevious,
} from "../../providers/store";
import styled from "styled-components/macro";
import TweetContent from "../TweetContent/TweetContent";
import { TABS_HEIGHT } from "../../utils/constants";
import { useTheme } from "@material-ui/core";
import { OpenTweetBtn } from "../BottomDrawer/BottomDrawer";
import useContainerDimensions from "../../utils/useContainerDimensions";
import {
  CUSTOM_SCROLLBAR_CSS,
  LOADING_SCROLLBAR_CSS,
} from "../common/styledComponents";
import { getMediaArr, useMount } from "../../utils/utils";
import BtnFavorite from "../common/BtnFavorite";
import CloseIcon from "@material-ui/icons/Close";
import { Tweet } from "../../types";
import BtnFetchMore from "./BtnFetchMore";
import { UserAvatar } from "../common/UserInfo";

/** smaller grid rows means finer but more time to compute layout */
const GRID_ROW_PX = 40;
const MIN_TWEET_WIDTH = 300;
const GRID_GAP = 24;

const GalleryStyles = styled.div`
  .galleryContent {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${MIN_TWEET_WIDTH}px, 1fr));
    grid-auto-flow: dense;
    align-items: center;
    grid-auto-rows: ${GRID_ROW_PX}px;
    grid-column-gap: ${GRID_GAP}px;
    width: 100%;
  }
  .tweetContent {
    position: relative;

    width: 100%;
    height: fit-content;

    display: grid;
    place-content: start;

    border: 1px solid hsl(0, 0%, ${(props) => (props.isLight ? "70" : "30")}%);
    margin: -0.5px;
    padding: 16px 16px 32px;

    .userAvatar {
      height: 48px;
      width: 48px;
      position: absolute;
      top: -24px;
      left: 8px;
      transform: scale(0.8);
      transform-origin: top right;
    }
  }

  .userAvatar {
    overflow: hidden;
    border-radius: 999px;
    &:before {
      content: "";
      background: hsl(0, 0%, 50%);
      position: absolute;
      width: 52px;
      height: 52px;
      top: -2px;
      left: -2px;
      border-radius: 999px;
    }
    img {
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      position: absolute;
      top: 2px;
      left: 2px;
      border-radius: 999px;
    }
  }
  width: 100%;
  padding: 18px;
  height: calc(100vh - ${TABS_HEIGHT}px);
  overflow-y: scroll;
  .tweetButtons {
    transform: scale(0.8);
    transform-origin: top right;
    position: absolute;
    bottom: -3px;
    right: 6px;
    color: tomato;
    display: grid;
    grid-auto-flow: column;
  }
  .btnFetchMoreWrapper {
    width: 100%;
    padding: 2rem 0;
  }
  .userAvatarWrapper {
    padding: 1rem 0;
    width: 100%;
    display: grid;
    grid-gap: 0.5rem;
    place-items: center;
    place-content: start;
    .userAvatar {
      width: 256px;
      height: 256px;
      position: relative;
      &:before {
        width: 68px;
        height: 68px;
        top: -2px;
        left: -2px;
      }
    }
  }
  ${CUSTOM_SCROLLBAR_CSS}
  ${(props) => (props.isLoading ? LOADING_SCROLLBAR_CSS : "")}
`;

const Gallery = () => {
  const nodes = useNodes();
  const prevTweets: Tweet[] = usePrevious(nodes || []);
  const theme = useTheme();
  const loading = useLoading();

  let firstUserId = "";
  const areAllTweetsSameUser =
    nodes.length > 0 &&
    nodes.reduce((acc, tweet, idx) => {
      if (idx === 0) {
        firstUserId = tweet.user.id;
      } else {
        acc = tweet.user.id === firstUserId;
      }
      return acc;
    }, true);

  // when we stream nodes,
  // if in "replace" mode,
  // scroll to top
  const ref = useRef();
  const { replace } = useConfig();
  useEffect(() => {
    const didJustDeleteOneTweet =
      prevTweets && Math.abs(nodes.length - (prevTweets?.length || 0)) === 1;
    if (
      !areAllTweetsSameUser &&
      !didJustDeleteOneTweet &&
      replace &&
      nodes.length !== 0 &&
      ref.current
    ) {
      (ref.current as any).scrollTop = 0;
    }
  }, [nodes, prevTweets, replace, areAllTweetsSameUser]);

  return (
    <GalleryStyles
      ref={ref}
      isLoading={loading}
      isLight={theme.palette.type === "light"}
    >
      {areAllTweetsSameUser && (
        <div className="userAvatarWrapper">
          <UserAvatar user={nodes[0]?.user} imageOnly={false} large={true} />
        </div>
      )}
      <div className="galleryContent">
        {nodes.map((tweet) => (
          <GridItem key={tweet.id} tweet={tweet} />
        ))}
      </div>
      {loading ? <ScrollMoreIndicator /> : null}
      {areAllTweetsSameUser && (
        <div className="btnFetchMoreWrapper">
          <BtnFetchMore user={nodes[0]?.user} />
        </div>
      )}
    </GalleryStyles>
  );
};

export default Gallery;

function GridItem({ tweet }: { tweet: Tweet }) {
  const [ref, dimensions] = useContainerDimensions();
  const rowSpan = Math.ceil(
    ((dimensions?.height || MIN_TWEET_WIDTH) + GRID_GAP) / GRID_ROW_PX
  );
  const isMediaTweet = Boolean(getMediaArr(tweet)[0]);
  const mediaArr = getMediaArr(tweet);
  const { firstItemWidth, totalHeight } = mediaArr.reduce(
    (acc, media, idx) => ({
      totalHeight: media.sizes.large.h + acc.totalHeight,
      firstItemWidth:
        (idx === 0 ? media.sizes.large.w : 0) + acc.firstItemWidth,
    }),
    { firstItemWidth: 0, totalHeight: 0 }
  );
  // TODO
  const tweetWidth = 430;
  const avatarSectionHeight = 150;
  const textSectionHeight = tweet.text ? 50 : 0;
  const height =
    (totalHeight / firstItemWidth) * tweetWidth +
    avatarSectionHeight +
    textSectionHeight;
  return (
    <div
      className="tweetContent"
      ref={ref}
      style={{
        gridRow: `span ${rowSpan}`,
        ...(isMediaTweet
          ? {
              height,
              gridTemplateRows: `auto repeat(${mediaArr.length}, auto)`,
            }
          : {}),
      }}
    >
      <UserAvatar user={tweet.user} imageOnly={true} />
      <div className="tweetButtons">
        <DeleteTweetBtn tweet={tweet} />
        <OpenTweetBtn tweet={tweet} />
        <BtnFavorite tweet={tweet} tooltipTitle="favorite tweet" />
      </div>
      <TweetContent tweet={tweet} isTooltip={false} autoPlay={false} />
    </div>
  );
}

function DeleteTweetBtn({ tweet }: { tweet: Tweet }) {
  const deleteTweet = useDeleteTweet();
  const handleDelete = useCallback(() => deleteTweet(tweet.id), [
    tweet.id,
    deleteTweet,
  ]);
  return <CloseIcon onClick={handleDelete} />;
}

const ScrollMoreStyles = styled.div`
  position: fixed;
  z-index: 99999;
  bottom: 4px;
  right: 4px;
  display: grid;
  grid-auto-flow: row;
  grid-gap: 8px;
  transition: all 0.3s ease-in;
  opacity: ${(props) => (props.mounted ? 1 : 0)};
  .dot {
    height: 12px;
    width: 12px;
    border-radius: 99px;
    background: hsla(0, 0%, 90%);
    animation: inOut 0.5s cubic-bezier(0.16, 0.41, 0.15, 1.01) infinite
      alternate-reverse;
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
  @keyframes inOut {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
function ScrollMoreIndicator() {
  const [mounted, setMounted] = useState(false);
  useMount(() => setMounted(true));
  return (
    <ScrollMoreStyles mounted={mounted}>
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </ScrollMoreStyles>
  );
}

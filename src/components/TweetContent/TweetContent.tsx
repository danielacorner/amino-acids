import React from "react";
import { getMediaArr } from "../../utils/utils";
import { TAB_INDICES } from "../../utils/constants";
import countryCodes from "../../utils/countryCodes";
import LocationIcon from "@material-ui/icons/LocationOnRounded";
import { TweetStyles } from "./TweetStyles";
import { Body2 } from "../common/styledComponents";
import { useSearchObj } from "../../providers/store";
import useContainerDimensions from "../../utils/useContainerDimensions";
import MediaContent from "./Media/MediaContent";
import { Place, Tweet, User } from "types";
import { useWindowSize } from "../../utils/hooks";
import TweetUserInfo from "./TweetUserInfo";

type TweetContentProps = {
  tweet: Tweet;
  offsetY?: number;
  autoPlay?: boolean;
  isTooltip?: boolean;
  isBottomDrawer?: boolean;
};

// tslint:disable-next-line: cognitive-complexity
export default function TweetContent({
  tweet,
  offsetY = 0,
  autoPlay = true,
  isTooltip = false,
  isBottomDrawer = false,
}: TweetContentProps) {
  const {
    user,
    text,
    retweeted_status,
    extended_tweet,
    extended_entities,
    place,
    in_reply_to_screen_name,
  } = tweet;
  const { height: windowHeight } = useWindowSize();
  const retweetedUser = getRetweetedUser(tweet);

  const mediaArr = getMediaArr(tweet);

  const fullText =
    extended_tweet?.full_text ||
    retweeted_status?.extended_tweet?.full_text ||
    retweeted_status?.text ||
    text;

  const textWithLinks = addLinksToText(fullText);
  console.log(
    "🌟🚨 ~ file: TweetContent.tsx ~ line 52 ~ textWithLinks",
    textWithLinks
  );

  const [ref, dimensions] = useContainerDimensions();
  const searchObj = useSearchObj();
  const { firstItemWidth, totalHeight } = mediaArr.reduce(
    (acc, media, idx) => ({
      totalHeight: media.sizes.large.h + acc.totalHeight,
      firstItemWidth:
        (idx === 0 ? media.sizes.large.w : 0) + acc.firstItemWidth,
    }),
    { firstItemWidth: 0, totalHeight: 0 }
  );

  return (
    <TweetStyles
      className={isBottomDrawer ? "bottomDrawerTweetStyles" : ""}
      ref={ref}
      isGallery={`${TAB_INDICES.GALLERY}` in searchObj}
      isRetweet={Boolean(retweetedUser)}
      isTooltip={isTooltip}
      isBottomDrawer={isBottomDrawer}
      videoHeight={Math.min(windowHeight, -offsetY + 270)}
      isVideo={extended_entities?.media[0]?.type === "video"}
      mediaHeight={totalHeight}
      mediaWidth={firstItemWidth}
    >
      <TweetUserInfo
        {...{
          retweetedUser,
          user,
          isTooltip,
          in_reply_to_screen_name,
        }}
      />
      {(user.location || place?.country_code) && (
        <LocationInfo {...{ user, place }} />
      )}
      <Body2 className="text">{textWithLinks}</Body2>
      {mediaArr.length > 0 && (
        <div className="allMedia">
          {mediaArr.map((mediaItem) => {
            return (
              <MediaContent
                key={mediaItem.id}
                {...mediaItem}
                {...{
                  autoPlay,
                  isTooltip,
                  isBottomDrawer,
                  numImages: mediaArr.length,
                  containerWidth: dimensions?.width || 0,
                  containerHeight: dimensions?.height || 0,
                }}
              />
            );
          })}
        </div>
      )}
    </TweetStyles>
  );
}

function LocationInfo({ user, place }: { user: User; place: Place | null }) {
  return (
    <Body2 className="locationInfo">
      {user.location && (
        <>
          <LocationIcon />
          {user.location}
        </>
      )}
      {place?.country_code && (
        <Body2 className="country">| {countryCodes[place?.country_code]}</Body2>
      )}
    </Body2>
  );
}

export function getRetweetedUser(tweet: Tweet): User | null {
  return tweet?.retweeted_status?.user || null;
}

function addLinksToText(fullText: string) {
  return (
    fullText
      .split(" ")
      // if first two are "RT: someUser", store separately
      .reduce((acc, cur, idx, array) => {
        const prev = array[idx - 1];

        if (cur === "RT") {
          return acc;
        } else if (prev === "RT") {
          return acc;
        } else {
          return [...acc, cur];
        }
      }, [] as string[])
      .map((word) =>
        word[0] === "@" ? (
          <a
            style={{ marginRight: "0.5ch" }}
            key={word}
            href={`https://twitter.com/${
              word.slice(-1) === ":" ? word.slice(1, -1) : word.slice(1)
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {word}
          </a>
        ) : word[0] === "#" ? (
          <a
            style={{ marginRight: "0.5ch" }}
            key={word}
            href={`https://twitter.com/hashtag/${word.slice(1)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {word}
          </a>
        ) : word.includes("https://t.co/") ? (
          ""
        ) : word.slice(0, 5) === "https" ? (
          <a
            style={{ marginRight: "0.5ch" }}
            key={word}
            href={word}
            target="_blank"
            rel="noopener noreferrer"
          >
            {word}
          </a>
        ) : (
          word + " "
        )
      )
  );
}

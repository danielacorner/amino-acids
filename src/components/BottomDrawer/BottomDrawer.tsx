import React, { useState, useEffect, useRef, useCallback } from "react";
import { Drawer, IconButton, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import TweetContent from "../TweetContent/TweetContent";
import UserInfo from "../common/UserInfo";
import useStore, { GlobalStateStoreType } from "../../providers/store";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import {
  BottomDrawerStyles,
  DrawerContentStyles,
  DRAWER_HEIGHT,
} from "./BottomDrawerStyles";
import { useMount } from "utils/utils";
import { Tweet } from "types";

const DRAWER_MAX_HEIGHT_MULTIPLIER = 3.5;

const BottomDrawer = () => {
  const setSelectedNode = useStore(
    (state) => (state as GlobalStateStoreType).setSelectedNode
  );
  const selectedNode = useStore(
    (state) => (state as GlobalStateStoreType).selectedNode
  );
  const [offsetY, setOffsetY] = useState(0);
  // const { height: windowHeight } = useWindowSize();
  const maxDrawerHeight = Infinity;
  // const maxDrawerHeight = windowHeight * DRAWER_MAX_HEIGHT_MULTIPLIER;

  // disable scrolling on the graph
  useMount(() => {
    disableScroll();
    // window.addEventListener(wheelEvent, handleWheel);
    return () => {
      enableScroll();
    };
  });

  const setBottomDrawerHeight = (newHeight: string) => {
    const bottomDrawerTweet = document.querySelector("bottomDrawerTweetStyles");
    if (bottomDrawerTweet) {
      (bottomDrawerTweet as HTMLElement).style.height = newHeight;
    }
  };

  const handleWheel = (event) => {
    const delta = offsetY - event.deltaY;
    setOffsetY(Math.min(maxDrawerHeight, delta));

    // set the tweetStyles height
    setBottomDrawerHeight(`${-offsetY + 200}px`);
  };
  const handleClose = useCallback(() => {
    setBottomDrawerHeight("0px");
    setSelectedNode(null);
  }, [setSelectedNode]);

  // when we click a new node, open the bottom drawer
  const prevSelectedNode = useRef(null as Tweet | null);
  useEffect(() => {
    if (selectedNode && selectedNode.id !== prevSelectedNode.current?.id) {
      prevSelectedNode.current = selectedNode;
      setOffsetY(maxDrawerHeight);
      const popUpBottomDrawer = () => {
        setBottomDrawerHeight(`${400}px`);
      };
      popUpBottomDrawer();
    }
  }, [selectedNode, maxDrawerHeight]);

  // close when we scroll the draewr down enough
  useEffect(() => {
    if (offsetY === DRAWER_HEIGHT - 100) {
      handleClose();
    }
  }, [offsetY, handleClose]);

  return (
    <BottomDrawerStyles>
      <Drawer
        anchor="bottom"
        open={Boolean(selectedNode)}
        onBackdropClick={handleClose}
        ModalProps={{
          onWheel: handleWheel,
          onClick: (event) => {
            if (
              (event.target as HTMLElement)?.getAttribute("role") ===
              "presentation"
            ) {
              handleClose();
            }
          },
          BackdropProps: {
            style: {
              // backgroundColor: "transparent",
              // transform: `translateY(calc(-100vh + ${
              //   DRAWER_HEIGHT - offsetY
              // }px))`,
            },
          },
        }}
        hideBackdrop={true}
        PaperProps={{
          style: {
            height: `${DRAWER_MAX_HEIGHT_MULTIPLIER * 100}vh`,
            overflow: "visible",
          },
        }}
        style={{
          bottom: `-${(DRAWER_MAX_HEIGHT_MULTIPLIER - 1) * 100}vh`,
          top: "-70vh",
          transform: `translateY(calc(100vh - ${DRAWER_HEIGHT - offsetY}px))`,
        }}
      >
        <DrawerContentStyles drawerHeight={-offsetY + 400}>
          {/* absolute-position below here */}
          <Tooltip title="delete">
            <IconButton className="btnClose" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <div className="userAndTweetWrapper">
            {/* non-absolute-position below here */}
            <div className="userWrapper">
              <UserInfo />
            </div>
            <div className="tweetContentWrapper">
              {selectedNode && (
                <TweetContent
                  {...{
                    offsetY,
                    tweet: selectedNode,
                    isBottomDrawer: true,
                  }}
                />
              )}
            </div>
          </div>
          {selectedNode?.user && (
            <OpenTweetBtn tweet={selectedNode} offsetY={offsetY} />
          )}
        </DrawerContentStyles>
      </Drawer>
    </BottomDrawerStyles>
  );
};

export function OpenTweetBtn({
  tweet,
  offsetY = 0,
}: {
  tweet: Tweet;
  offsetY?: number;
}) {
  return (
    <a
      className="viewTweet"
      style={{ transform: `translateY(${-offsetY}px)` }}
      href={`https://www.twitter.com/${tweet.user.screen_name}/status/${tweet.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Tooltip title="Open in new">
        <OpenInNewIcon />
      </Tooltip>
    </a>
  );
}

export default BottomDrawer;

// https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

const wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

function preventDefault(e: Event) {
  e.preventDefault();
}
function preventDefaultForScrollKeys(e: KeyboardEvent) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}
// call this to Disable
function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault); // modern desktop
  window.addEventListener("touchmove", preventDefault); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault);
  window.removeEventListener("touchmove", preventDefault);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

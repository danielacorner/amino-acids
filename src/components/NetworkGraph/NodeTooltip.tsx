import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components/macro";
import { PADDING } from "../../utils/utils";
import useStore from "../../providers/store";
import useContainerDimensions from "../../utils/useContainerDimensions";
import { useWindowSize } from "../../utils/hooks";
import { CONTROLS_WIDTH } from "../../utils/constants";
import { useIsLight } from "../../providers/ThemeManager";
import { Tweet } from "types";
import { RowDiv } from "../common/styledComponents";

const AVATAR_WIDTH = 46;
const TOOLTIP_WIDTH = 380;
const MOUSE_WIDTH = 12;
const WINDOW_PADDING_HZ = 12;
const WINDOW_PADDING_VERT = 12;

const TooltipStyles = styled.div`
  opacity: 0.9;
  pointer-events: none;
  border-radius: 4px;
  background: ${(props) => (props.isLight ? "white" : "black")};
  width: ${TOOLTIP_WIDTH}px;
  height: fit-content;
  box-shadow: 1px 1px 8px hsla(0, 0%, 0%, 0.5);
  padding: ${PADDING}px;
  .profileAndContent {
    display: grid;
    grid-gap: ${PADDING}px;
    grid-template-columns: ${AVATAR_WIDTH}px 1fr;
  }
  position: relative;
  .id {
    font-size: 0.7em;
    position: absolute;
    top: -16px;
    right: 0;
    text-shadow: 1px -1px 0px white;
  }
`;

const AvatarStyles = styled.div`
  width: ${AVATAR_WIDTH}px;
  height: ${AVATAR_WIDTH}px;
  border-radius: 50%;
  overflow: hidden;
`;

const NodeTooltip = () => {
  const tooltipNode = useStore((state) => state.tooltipNode);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastTooltipNode = useRef(null as Tweet | null);
  const [ref, dimensions] = useContainerDimensions();
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const tooltipHeight = dimensions?.height || 0;
  const minYPosition = windowHeight - tooltipHeight - WINDOW_PADDING_VERT;
  const minXPosition =
    windowWidth - TOOLTIP_WIDTH - MOUSE_WIDTH - WINDOW_PADDING_HZ;

  useEffect(() => {
    if (tooltipNode) {
      lastTooltipNode.current = tooltipNode;
    }
  });

  const handleMouseMove = useCallback(
    (event) => {
      const x = Math.max(CONTROLS_WIDTH, Math.min(event.x, minXPosition));
      const y = Math.min(event.y, minYPosition);
      setPosition({ x, y });
    },
    [minXPosition, minYPosition]
  );

  // on mount, start listening to mouse position
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [minYPosition, minXPosition, handleMouseMove]);

  const springToMousePosition = useSpring({
    pointerEvents: "none",
    position: "fixed",
    opacity: tooltipNode ? 1 : 0,
    top: 16,
    left: MOUSE_WIDTH,
    transform: `translate(${position.x}px,${position.y}px)`,
    config: { tension: 170, mass: 0.1 },
    onRest: () => {
      if (!tooltipNode) {
        lastTooltipNode.current = null;
      }
    },
  });

  const tweet: Tweet = tooltipNode || (lastTooltipNode.current as Tweet);
  const isLight = useIsLight();

  const originalPoster = tweet?.user;
  return (
    <NodeTooltipContent
      {...{ springToMousePosition, ref, isLight, originalPoster, tweet }}
    />
  );
};

export default NodeTooltip;

export type NodeTooltipContentProps = {
  springToMousePosition: any;
  ref: React.MutableRefObject<any>;
  isLight: boolean;
  originalPoster: any;
  tweet: Tweet | null;
  tooltipStyles?: any;
};
export const NodeTooltipContent = React.forwardRef(
  (
    {
      springToMousePosition,
      isLight,
      originalPoster,
      tweet,
      tooltipStyles,
    }: NodeTooltipContentProps,
    ref
  ) => {
    return (
      <animated.div style={springToMousePosition}>
        <TooltipStyles ref={ref} isLight={isLight} style={tooltipStyles}>
          <div className="profileAndContent">
            <RowDiv style={{ alignItems: "start" }}>
              <AvatarStyles>
                <img src={originalPoster?.profile_image_url_https} alt="" />
              </AvatarStyles>
            </RowDiv>
            {tweet && (
              <>
                <div className="id_str">{tweet.id}</div>
              </>
            )}
          </div>
        </TooltipStyles>
      </animated.div>
    );
  }
);

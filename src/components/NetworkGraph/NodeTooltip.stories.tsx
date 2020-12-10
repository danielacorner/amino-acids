import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
  mockTweetWithVideo,
  mockTweetWithImage,
  mockTweetWithText,
} from "../../assets/mockData";
import {
  NodeTooltipContent,
  NodeTooltipContentProps,
} from "../../components/NetworkGraph/NodeTooltip";
import { Tweet } from "types";
import ThemeManager from "providers/ThemeManager";

export default {
  title: "NetworkGraph/NodeTooltip",
  component: NodeTooltipContent,
  args: {
    springToMousePosition: {
      pointerEvents: "none",
      position: "fixed",
      opacity: 1,
      top: 16,
      left: 16,
      transform: `translate(${0}px,${0}px)`,
    },
    isLight: false,
    tooltipStyles: {
      pointerEvents: "auto",
    },
  },
} as Meta;

// https://www.learnstorybook.com/intro-to-storybook/react/en/simple-component/

// As we have multiple permutations of our component, it's convenient to assign it to a Template variable.
// Introducing this pattern in your stories will reduce the amount of code you need to write and maintain.
const Template: Story<NodeTooltipContentProps> = (args) => (
  <ThemeManager>
    <NodeTooltipContent {...args} />
  </ThemeManager>
);

function getArgs(tweet: any) {
  return {
    originalPoster: tweet.user,
    tweet: (tweet as unknown) as Tweet,
  };
}

export const TooltipTweetTextOnly = Template.bind({});
TooltipTweetTextOnly.args = getArgs(mockTweetWithText);

export const TooltipTweetAndVideo = Template.bind({});
TooltipTweetAndVideo.args = getArgs(mockTweetWithVideo);

export const TooltipTweetAndImage = Template.bind({});
TooltipTweetAndImage.args = getArgs(mockTweetWithImage);

import React, { useRef } from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import mockGraphWithUsers from "../../assets/mockGraphWithUsers.json";
// import { mockTweetWithMedia } from "../../assets/mockData";
import { ForceGraph2D } from "react-force-graph";
import { GraphStyles } from "./NetworkGraph";
import { useTheForce } from "./useTheForce";
import { useForceGraphProps } from "./useForceGraphProps";

const mockForceGraphProps = {
  width: 794,
  height: 1009,
  d3VelocityDecay: 1,
  d3AlphaDecay: 1,
  cooldownTime: 0,
  cooldownTicks: 0,
  nodeRelSize: 25,
  linkWidth: 1,
  backgroundColor: "transparent",
  enableZoomPanInteraction: true,
  enableNavigationControls: true,
  enablePointerInteraction: true,
  enableNodeDrag: true,
};

const WIDTH = 600;

const MockNetworkGraph: typeof ForceGraph2D = (props) => {
  console.log("🌟🚨: props", props);
  const fgRef = useRef();
  // useTheForce(fg, props.graphData);
  useTheForce(fgRef.current, mockGraphWithUsers);
  const forceGraphProps = useForceGraphProps();
  return (
    <GraphStyles style={{ height: WIDTH, width: WIDTH, background: "black" }}>
      <ForceGraph2D
        ref={fgRef}
        {...forceGraphProps}
        {...props}
        width={WIDTH}
        height={WIDTH}
      />
    </GraphStyles>
  );
};

export default {
  title: "NetworkGraph/Graph2D",
  component: MockNetworkGraph,
  args: {
    ...mockForceGraphProps,
    graphData: mockGraphWithUsers,
  },
} as Meta;

// https://www.learnstorybook.com/intro-to-storybook/react/en/simple-component/

// As we have multiple permutations of our component, it's convenient to assign it to a Template variable.
// Introducing this pattern in your stories will reduce the amount of code you need to write and maintain.
const Template: Story<any> = (args) => <MockNetworkGraph {...args} />;

export const UserNodeWithBotScore = Template.bind({});
export const UserNodeWithMedia = Template.bind({
  graphData: {
    ...mockGraphWithUsers,
    // nodes: [...mockGraphWithUsers.nodes, mockTweetWithMedia],
  },
});
export const UserNodeWithImage = Template.bind({ graphData: {} });

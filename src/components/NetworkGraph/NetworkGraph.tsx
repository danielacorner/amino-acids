import React from "react";
import NodeTooltip from "./NodeTooltip";
// https://www.npmjs.com/package/react-force-graph
import styled from "styled-components/macro";
import GraphRightClickMenu from "./GraphRightClickMenu";
import ThreeDee from "./ThreeDee";

export const GraphStyles = styled.div`
  width: 100%;
`;

const NetworkGraph = () => {
  return (
    <GraphStyles>
      <Graph />
      <NodeTooltip />
      <GraphRightClickMenu />
    </GraphStyles>
  );
};

// https://github.com/vasturiano/react-force-graph
// tslint:disable-next-line: cognitive-complexity
function Graph() {
  // const { fgRef } = useForceGraphProps();

  // uncomment to grab the current state and copy-paste into mockTweetsData.json

  // console.log("🌟🚨: Graph -> mockTweetsData", {
  //   nodes,
  //   retweetsByTweetId,
  //   likesByUserId,
  // });

  // dynamic force graph updates WITHOUT re-rendering every node example: https://github.com/vasturiano/react-force-graph/blob/master/example/dynamic/index.html

  // New force graph nodes should be able to mount without causing all others to re-mount
  // But, for some reason, using graphData as ForceGraph props caused every node to re-render on every change of graphData.

  // Instead, it seems to work if we manually sync it to some state,
  // and use the setState (setGraph) callback function to update

  // const fg = fgRef.current as any;

  //
  // use the force (d3 force simulation controls)
  //
  // useTheForce(fg, graph);

  return <ThreeDee />;
}

export default NetworkGraph;

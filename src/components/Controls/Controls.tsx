import React from "react";
import { Button } from "@material-ui/core";
import { useConfig } from "../../providers/store";
import { ControlsStyles } from "./ControlsStyles";
import WordcloudControls from "./WordcloudControls";
import NetworkGraphControls from "./NetworkGraphControls";
import FetchTweetsControls from "./FetchTweetsControls";

const Controls = () => {
  // TODO
  const createLinks = () => {
    console.log("TODO");
  };
  return (
    <ControlsStyles>
      <VizSpecificControls />
      <FetchTweetsControls />
      <Button onClick={createLinks}>Link Nodes</Button>
    </ControlsStyles>
  );
};

export default Controls;

function VizSpecificControls() {
  const { isWordcloud, isNetworkGraph } = useConfig();
  console.log("🌟🚨: VizSpecificControls -> isWordcloud", isWordcloud);
  return isWordcloud ? (
    <WordcloudControls />
  ) : isNetworkGraph ? (
    <NetworkGraphControls />
  ) : null;
}

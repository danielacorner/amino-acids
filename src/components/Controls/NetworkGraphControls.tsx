import React from "react";
import { ForceSimulationControls } from "./ForceSimulationControls";
/** react-force-graph docs
 * https://www.npmjs.com/package/react-force-graph
 */
const NetworkGraphControls = () => {
  return (
    <div className="networkGraphControls controlsContainer">
      <ForceSimulationControls />
    </div>
  );
};

export default NetworkGraphControls;

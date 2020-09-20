import React from "react";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@material-ui/core";
import { COLOR_BY } from "../../utils/constants";
import { useConfig, AppConfig } from "../../providers/store";
import { H5, CollapsibleSwitchWithLabels } from "../common/styledComponents";

const NetworkGraphControls = () => {
  // TODO
  const createLinks = () => {
    console.log("TODO");
  };
  return (
    <>
      <H5 style={{ pointerEvents: "none" }}>Network Graph Controls</H5>
      <Switch3D />
      <SelectColorBy />
      <Button
        variant="contained"
        color="primary"
        disabled={true}
        onClick={createLinks}
      >
        Link Nodes
      </Button>
    </>
  );
};

export default NetworkGraphControls;

function Switch3D() {
  const { is3d, setConfig } = useConfig();
  return (
    <CollapsibleSwitchWithLabels
      labelLeft="2D"
      labelRight="3D"
      onChange={() => setConfig({ is3d: !is3d })}
      checked={is3d}
    />
  );
}

function SelectColorBy() {
  const { setConfig, colorBy } = useConfig();
  return (
    <FormControl>
      <InputLabel id="color-by">Color by...</InputLabel>
      <Select
        labelId="color-by"
        onChange={(event) => {
          setConfig({ colorBy: event.target.value as AppConfig["colorBy"] });
        }}
        value={colorBy}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={COLOR_BY.mediaType}>Media type</MenuItem>
        <MenuItem value={COLOR_BY.media}>Media</MenuItem>
        <MenuItem value={COLOR_BY.textLength}>Text length</MenuItem>
        <MenuItem value={COLOR_BY.sentiment}>Sentiment</MenuItem>
        <MenuItem value={COLOR_BY.profilePhoto}>Profile Photo</MenuItem>
      </Select>
    </FormControl>
  );
}

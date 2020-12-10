import React from "react";
import { Tabs, Tab, Typography } from "@material-ui/core";
import NetworkGraph from "./NetworkGraph/NetworkGraph";
import Wordcloud from "./Wordcloud/Wordcloud";
import styled from "styled-components/macro";
import Gallery from "./Gallery/Gallery";
import { TABS_HEIGHT, TAB_INDICES } from "../utils/constants";

const Div = styled.div``;

function a11yProps(index: any) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function VisualizationTabs() {
  // sync tab index & tweet ids to url
  const tabIndex = 0;
  const handleChange = () => {};
  return (
    <Div
      className="visualizationTabs"
      css={`
        display: grid;
        place-items: center;
        grid-template-rows: auto 1fr;
        max-height: 100vh;
        width: 100%;
        .tabs {
          width: 100%;
          display: grid;
          height: ${TABS_HEIGHT}px;
          justify-content: start;
          box-shadow: 0px 2px 2px 0px #0000003d;
        }
      `}
    >
      <Tabs
        value={0}
        onChange={handleChange}
        className="tabs"
        aria-label="simple tabs example"
      >
        <Tab
          label={
            <Typography variant="button" color="textPrimary">
              Network Graph
            </Typography>
          }
          {...a11yProps(0)}
        />
        <Tab
          label={
            <Typography variant="button" color="textPrimary">
              Word Cloud
            </Typography>
          }
          {...a11yProps(1)}
        />
        {process.env.NODE_ENV === "development" && (
          <Tab
            label={
              <Typography variant="button" color="textPrimary">
                Gallery
              </Typography>
            }
            {...a11yProps(2)}
          />
        )}
      </Tabs>
      <TabPanel value={tabIndex} index={TAB_INDICES.NETWORKGRAPH}>
        <NetworkGraph />
      </TabPanel>
      <TabPanel value={tabIndex} index={TAB_INDICES.WORDCLOUD}>
        <Wordcloud />
      </TabPanel>
      {process.env.NODE_ENV === "development" && (
        <TabPanel value={tabIndex} index={TAB_INDICES.GALLERY}>
          <Gallery />
        </TabPanel>
      )}
    </Div>
  );
}

function TabPanel({ children, value, index, ...other }: any) {
  const hidden = value !== index;
  return (
    <div
      style={hidden ? {} : { height: "100%", width: "100%" }}
      role="tabpanel"
      hidden={hidden}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {!hidden && (
        <Div
          css={`
            height: 100%;
            width: 100%;
            display: grid;
            place-items: center;
          `}
        >
          {children}
        </Div>
      )}
    </div>
  );
}

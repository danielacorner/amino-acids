import React from "react";
import styled from "styled-components/macro";
import { Typography, Switch, Tooltip } from "@material-ui/core";
import { FORM_HEIGHT } from "../../utils/constants";

export const ColumnDiv = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
`;
export const RowDiv = styled.div`
  display: flex;
  place-items: center;
  place-content: center;
`;

export const H5 = ({ children, ...props }) => (
  <Typography color="textPrimary" variant="h5" {...props}>
    {children}
  </Typography>
);
export const H6 = ({ children, ...props }) => (
  <Typography
    color="textPrimary"
    variant="h6"
    style={{ fontSize: "1.2rem" }}
    {...props}
  >
    {children}
  </Typography>
);
export const Body1 = ({ children, ...props }) => (
  <Typography color="textPrimary" variant="body1" {...props}>
    {children}
  </Typography>
);
export const Body2 = ({ children, ...props }) => (
  <Typography color="textPrimary" variant="body2" {...props}>
    {children}
  </Typography>
);

export const CUSTOM_SCROLLBAR_CSS = `
@supports (overflow: overlay){
  overflow: overlay;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 16px;
    background: none;
  }
  /* directional buttons */
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
    display: none;
  }
  /* empty space "below" the progress bar */
  &::-webkit-scrollbar-track {
    background: none;
  }
  /* top-most layer of the progress bar not covered by the draggable scrolling element */
  &::-webkit-scrollbar-track-piece {
    background: none;
  }
  /* draggable scrolling element that resizes depending on the size of the scrollable element */
  &::-webkit-scrollbar-thumb {
    border: 4px solid transparent;
    border-radius: 99px;
    background-color: rgba(88, 89, 91, 0.2);
    box-sizing: border-box;
    background-clip: padding-box;
    padding: 10px;
    transition: all 0.5s ease;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(88, 89, 91, 0.6);
  }
  /* the (usually) bottom corner of the scrollable element, where two scrollbars might meet */
  &::-webkit-scrollbar-corner {
    background: none;
  }

}
`;
export const LOADING_SCROLLBAR_CSS = `
&::-webkit-scrollbar-thumb {
  background: linear-gradient(47deg, #31bd9a90, #09614b90);
  background-size: 105% 105%;
  -webkit-animation: background-animate 0.2s ease infinite;
  -moz-animation: background-animate 0.2s ease infinite;
  -o-animation: background-animate 0.2s ease infinite;
  animation: background-animate 0.2s ease infinite;
}

}
`;

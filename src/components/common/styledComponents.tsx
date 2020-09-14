import React from "react";
import styled from "styled-components/macro";
import { Typography, Switch } from "@material-ui/core";
import { FORM_HEIGHT } from "../Controls/ControlsStyles";

export const Div = styled.div`
  display: grid;
  place-items: center;
`;

export const H5 = ({ children }) => (
  <Typography color="textPrimary" variant="h5">
    {children}
  </Typography>
);
export const H6 = ({ children }) => (
  <Typography color="textPrimary" variant="h6">
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
export const SwitchWithLabels = ({
  labelLeft,
  labelRight,
  onChange,
  checked,
  ...props
}) => (
  <Div
    css={`
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      justify-content: center;
      height: ${FORM_HEIGHT}px;
    `}
  >
    <Body1>{labelLeft}</Body1>
    <Switch onChange={onChange} checked={checked} {...props} />
    <Body1>{labelRight}</Body1>
  </Div>
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
&::-webkit-scrollbar {
  width: 16px;
  background: none;
}
&::-webkit-scrollbar-thumb {
  border: 4px dashed white;
  border-radius: 99px;
  background-color: rgba(88, 89, 91, 0.8);
}
`;
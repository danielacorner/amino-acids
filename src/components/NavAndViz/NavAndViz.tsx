import NetworkGraph from "components/NetworkGraph/NetworkGraph";
import React from "react";

import styled from "styled-components/macro";

const NavAndVizStyles = styled.div`
  padding: 0.5em 1em;
  min-height: 100vh;
`;

const NavAndViz = () => {
  return (
    <NavAndVizStyles>
      <NetworkGraph />
    </NavAndVizStyles>
  );
};

export default NavAndViz;

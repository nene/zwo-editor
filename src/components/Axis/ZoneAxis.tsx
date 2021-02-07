import React from "react";
import styled from "styled-components";
import { Zones } from "../../types/Zones";

const ZoneAxis = () => (
  <Container>
    {Object.entries(Zones)
      .reverse()
      .map(([name, zone]) => (
        <ZoneItem key={name} zone={zone}>
          {name}
        </ZoneItem>
      ))}
  </Container>
);

const Container = styled.div`
  position: absolute;
  bottom: 50px;
  left: 2px;
  color: gray;
`;

const ZoneItem = styled.div<{ zone: { max: number } }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${({ zone }) => zone.max * 250}px;

  /* Zone 6 has no upper bound */
  &:not(:first-child) {
    border-top: 1px solid gray;
  }
`;

export default ZoneAxis;

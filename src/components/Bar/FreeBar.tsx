import React, { useState } from "react";
import styled from "styled-components";
import { Resizable } from "re-resizable";
import "moment-duration-format";
import Tooltip from "../Tooltip/Tooltip";
import { FreeInterval } from "../../types/Interval";
import { durationMultiplier } from "./multipliers";
import { WorkoutMode } from "../../modes/WorkoutMode";
import freerideSvg from "../../assets/freeride.svg";
import { BarIcons } from "./BarIcons";

interface FreeBarProps {
  interval: FreeInterval;
  mode: WorkoutMode;
  onChange: (interval: FreeInterval) => void;
  onClick: (id: string) => void;
  selected: boolean;
}

const FreeBar = ({ interval, mode, ...props }: FreeBarProps) => {
  const [width, setWidth] = useState(mode.lengthToWidth(interval.length));

  const [showTooltip, setShowTooltip] = useState(false);

  const handleCadenceChange = (cadence: number | undefined) => {
    props.onChange({ ...interval, cadence });
  };

  // standard height
  const height = 100;

  const handleResizeStop = (dWidth: number) => {
    setWidth(width + dWidth);
    notifyChange(dWidth);
  };

  const notifyChange = (dWidth: number) => {
    props.onChange({ ...interval, length: mode.widthToLength(width + dWidth) });
  };

  return (
    <Container
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={props.selected ? { zIndex: 1 } : {}}
      onClick={() => props.onClick(interval.id)}
    >
      {(props.selected || showTooltip) && (
        <Tooltip
          interval={interval}
          mode={mode}
          onCadenceChange={(cadence) => handleCadenceChange(cadence)}
        />
      )}
      <ResizableFreeBar
        size={{
          width: mode.lengthToWidth(interval.length),
          height: height,
        }}
        minWidth={durationMultiplier}
        minHeight={height}
        maxHeight={height}
        enable={{ right: true }}
        grid={[1, 1]}
        onResizeStop={(e, direction, ref, d) => handleResizeStop(d.width)}
        onResize={(e, direction, ref, d) => notifyChange(d.width)}
      >
        <FreeBarIcons
          cadence={interval.cadence}
          instructions={interval.instructions}
        />
      </ResizableFreeBar>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const ResizableFreeBar = styled(Resizable)`
  border: 1px solid white;
  background-image: url("${freerideSvg}");
`;

const FreeBarIcons = styled(BarIcons)`
  padding-top: 18px;
`;

export default FreeBar;

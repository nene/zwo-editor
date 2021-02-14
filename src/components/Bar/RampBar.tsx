import React, { useState } from "react";
import styled from "styled-components";
import { zoneColor, ZoneColor, Zones, ZonesArray } from "../../types/Zones";
import { Resizable } from "re-resizable";
import Tooltip from "../Tooltip/Tooltip";
import { RampInterval } from "../../types/Interval";
import { intensityMultiplier } from "./multipliers";
import { WorkoutMode } from "../../modes/WorkoutMode";
import { BarIcons } from "./BarIcons";

interface IDictionary {
  [index: string]: number;
}

interface RampBarProps {
  interval: RampInterval;
  mode: WorkoutMode;
  onChange: (interval: RampInterval) => void;
  onClick: (id: string) => void;
  selected: boolean;
}

const RampBar = ({ interval, mode, ...props }: RampBarProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCadenceChange = (cadence: number | undefined) => {
    props.onChange({ ...interval, cadence: cadence });
  };

  const width = mode.lengthToWidth(interval.length);
  const [resizableWidth, setResizableWidth] = useState(width);

  const startHeight = mode.intensityToHeight(interval.startIntensity);
  const [resizableStartHeight, setResizableStartHeight] = useState(startHeight);

  const endHeight = mode.intensityToHeight(interval.endIntensity);
  const [resizableEndHeight, setResizableEndHeight] = useState(endHeight);

  const handleStartResizeStop = (dHeight: number) => {
    setResizableStartHeight(resizableStartHeight + dHeight);
  };
  const handleEndResizeStop = (dWidth: number, dHeight: number) => {
    setResizableWidth(resizableWidth + dWidth);
    setResizableEndHeight(resizableEndHeight + dHeight);
  };

  const handleStartResize = (dHeight: number) => {
    props.onChange({
      ...interval,
      startIntensity: mode.heightToIntensity(resizableStartHeight + dHeight),
    });
  };
  const handleEndResize = (dWidth: number, dHeight: number) => {
    props.onChange({
      ...interval,
      length: mode.widthToLength(resizableWidth + dWidth),
      startIntensity: mode.heightToIntensity(resizableStartHeight),
      endIntensity: mode.heightToIntensity(resizableEndHeight + dHeight),
    });
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
      <Ramp onClick={() => props.onClick(interval.id)}>
        <ResizableRamp
          size={{
            width: resizableWidth / 2,
            height: resizableStartHeight,
          }}
          minWidth={3}
          minHeight={intensityMultiplier * Zones.Z1.min}
          maxHeight={intensityMultiplier * Zones.Z6.max}
          enable={{ top: true, right: true }}
          grid={[1, 1]}
          onResizeStop={(e, direction, ref, d) =>
            handleStartResizeStop(d.height)
          }
          onResize={(e, direction, ref, d) => handleStartResize(d.height)}
        >
          <BarIcons
            height={startHeight > endHeight ? endHeight : startHeight}
            cadence={interval.cadence}
            instructions={interval.instructions}
          />
        </ResizableRamp>
        <ResizableRamp
          size={{
            width: resizableWidth / 2,
            height: resizableEndHeight,
          }}
          minWidth={3}
          minHeight={intensityMultiplier * Zones.Z1.min}
          maxHeight={intensityMultiplier * Zones.Z6.max}
          enable={{ top: true, right: true }}
          grid={[1, 1]}
          onResizeStop={(e, direction, ref, d) =>
            handleEndResizeStop(d.width, d.height)
          }
          onResize={(e, direction, ref, d) =>
            handleEndResize(d.width, d.height)
          }
        ></ResizableRamp>
      </Ramp>
      <Rainbow
        interval={interval}
        startHeight={startHeight}
        endHeight={endHeight}
      />
      <SvgPolygons
        width={width}
        startHeight={startHeight}
        endHeight={endHeight}
      />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const Ramp = styled.div`
  display: flex;
  align-items: flex-end;
`;

const ResizableRamp = styled(Resizable)`
  border-top: 1px dotted gray;
  z-index: 5;
`;

const Rainbow: React.FC<{
  interval: RampInterval;
  startHeight: number;
  endHeight: number;
}> = ({ interval, startHeight, endHeight }) => {
  const trapezeHeight = endHeight > startHeight ? endHeight : startHeight;
  const bars =
    endHeight > startHeight
      ? calculateColors(interval.startIntensity, interval.endIntensity)
      : calculateColors(interval.endIntensity, interval.startIntensity);
  const flexDirection = endHeight > startHeight ? "row" : "row-reverse";

  return (
    <RampColors
      style={{
        height: trapezeHeight,
        flexDirection: flexDirection,
        backgroundColor: zoneColor(interval.startIntensity),
      }}
    >
      <Color
        style={{
          backgroundColor: ZoneColor.GRAY,
          width: `${
            (bars["Z1"] * 100) /
            Math.abs(interval.endIntensity - interval.startIntensity)
          }%`,
        }}
      />
      <Color
        style={{
          backgroundColor: ZoneColor.BLUE,
          width: `${
            (bars["Z2"] * 100) /
            Math.abs(interval.endIntensity - interval.startIntensity)
          }%`,
        }}
      />
      <Color
        style={{
          backgroundColor: ZoneColor.GREEN,
          width: `${
            (bars["Z3"] * 100) /
            Math.abs(interval.endIntensity - interval.startIntensity)
          }%`,
        }}
      />
      <Color
        style={{
          backgroundColor: ZoneColor.YELLOW,
          width: `${
            (bars["Z4"] * 100) /
            Math.abs(interval.endIntensity - interval.startIntensity)
          }%`,
        }}
      />
      <Color
        style={{
          backgroundColor: ZoneColor.ORANGE,
          width: `${
            (bars["Z5"] * 100) /
            Math.abs(interval.endIntensity - interval.startIntensity)
          }%`,
        }}
      />
      <Color
        style={{
          backgroundColor: ZoneColor.RED,
          width: `${
            (bars["Z6"] * 100) /
            Math.abs(interval.endIntensity - interval.startIntensity)
          }%`,
        }}
      />
    </RampColors>
  );
};

const RampColors = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  display: flex;
`;

const Color = styled.div`
  &:first-child {
    border-bottom-left-radius: 5px;
  }
  &:last-child {
    border-bottom-right-radius: 5px;
  }
`;

function calculateColors(start: number, end: number): IDictionary {
  const bars = {} as IDictionary;

  ZonesArray.forEach((zone, index) => {
    if (start >= zone[0] && start < zone[1]) {
      bars["Z" + (index + 1)] = zone[1] - start;
    } else if (end >= zone[0] && end < zone[1]) {
      bars["Z" + (index + 1)] = end - zone[0];
    } else if (end >= zone[1] && start < zone[0]) {
      bars["Z" + (index + 1)] = zone[1] - zone[0];
    } else {
      bars["Z" + (index + 1)] = 0;
    }
  });
  return bars;
}

const SvgPolygons: React.FC<{
  width: number;
  startHeight: number;
  endHeight: number;
}> = ({ width, startHeight, endHeight }) => {
  const trapezeHeight = endHeight > startHeight ? endHeight : startHeight;
  const trapezeTop =
    endHeight > startHeight ? endHeight - startHeight : startHeight - endHeight;

  const vertexB = endHeight > startHeight ? 0 : width;
  const vertexA = endHeight > startHeight ? trapezeTop : 0;
  const vertexD = endHeight > startHeight ? 0 : trapezeTop;

  return (
    <RampSvg height={`${trapezeHeight}`} width={`${width}`}>
      <TransparentPolygon
        points={`0,${vertexA} 0,${trapezeHeight} ${width},${trapezeHeight} ${width},${vertexD}`}
      />
      <HiddenPolygon points={`0,0 ${vertexB},${trapezeTop} ${width},0`} />
    </RampSvg>
  );
};

const RampSvg = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const TransparentPolygon = styled.polygon`
  fill: transparent;
`;

const HiddenPolygon = styled.polygon`
  fill: white;
  display: hidden;
`;

export default RampBar;

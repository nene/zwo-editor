import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { zoneColor, Zones } from "../../types/Zones";
import { Resizable } from "re-resizable";
import Tooltip from "../Tooltip/Tooltip";
import { SteadyInterval } from "../../types/Interval";
import { intensityMultiplier } from "./multipliers";
import { WorkoutMode } from "../../modes/WorkoutMode";
import cadenceImage from "../../assets/cadence.png";
import { Instruction } from "../../types/Instruction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

interface SteadyBarProps {
  interval: SteadyInterval;
  mode: WorkoutMode;
  onChange: (interval: SteadyInterval) => void;
  onClick: (id: string) => void;
  selected: boolean;
  showTooltip: boolean;
}

const SteadyBar = ({ interval, mode, ...props }: SteadyBarProps) => {
  const style = {
    backgroundColor: zoneColor(interval.intensity),
  };

  const [width, setWidth] = useState(mode.lengthToWidth(interval.length));

  const [height, setHeight] = useState(
    mode.intensityToHeight(interval.intensity)
  );

  const [showTooltip, setShowTooltip] = useState(false);

  const [selected, setSelected] = useState(props.selected);

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  const handleCadenceChange = (cadence: number | undefined) => {
    props.onChange({ ...interval, cadence });
  };

  const handleResizeStop = (dWidth: number, dHeight: number) => {
    setWidth(width + dWidth);
    setHeight(height + dHeight);

    notifyChange(dWidth, dHeight);
  };

  const notifyChange = (dWidth: number, dHeight: number) => {
    props.onChange({
      ...interval,
      length: mode.widthToLength(width + dWidth),
      intensity: mode.heightToIntensity(height + dHeight),
    });
  };

  return (
    <Container
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => props.onClick(interval.id)}
      style={props.selected ? { zIndex: 10 } : {}}
    >
      {(selected || showTooltip) && props.showTooltip && (
        <Tooltip
          interval={interval}
          mode={mode}
          onCadenceChange={(cadence) => handleCadenceChange(cadence)}
        />
      )}
      <RoundedResizable
        size={{
          width: mode.lengthToWidth(interval.length),
          height: mode.intensityToHeight(interval.intensity),
        }}
        minWidth={3}
        minHeight={intensityMultiplier * Zones.Z1.min}
        maxHeight={intensityMultiplier * Zones.Z6.max}
        enable={{ top: true, right: true }}
        grid={[1, 1]}
        onResizeStop={(e, direction, ref, d) =>
          handleResizeStop(d.width, d.height)
        }
        onResize={(e, direction, ref, d) => notifyChange(d.width, d.height)}
        style={style}
      >
        <Icons
          cadence={interval.cadence}
          instructions={interval.instructions}
        />
      </RoundedResizable>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const RoundedResizable = styled(Resizable)`
  border-radius: 10px;
  border: 1px solid white;
`;

const Icons: React.FC<{ cadence?: number; instructions: Instruction[] }> = ({
  cadence,
  instructions,
}) => (
  <IconsWrap>
    {cadence && (
      <IconLine>
        <img src={cadenceImage} alt="Has cadence" width="16" />
        <span>{cadence}</span>
      </IconLine>
    )}
    {instructions.length > 0 && (
      <IconLine>
        <FontAwesomeIcon
          icon={faComment}
          size="sm"
          fixedWidth={true}
          color="white"
        />
        <span>{instructions.length}</span>
      </IconLine>
    )}
  </IconsWrap>
);

const IconsWrap = styled.div`
  padding: 2px;
  color: white;
`;

const IconLine = styled.div`
  display: flex;
  align-items: center;
  & > span {
    padding-left: 5px;
  }
`;

export default SteadyBar;

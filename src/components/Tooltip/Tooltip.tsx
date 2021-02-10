import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faClock, faRuler } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {
  FreeInterval,
  RampInterval,
  SteadyInterval,
} from "../../types/Interval";
import { WorkoutMode } from "../../modes/WorkoutMode";
import BikeMode from "../../modes/BikeMode";
import RunMode from "../../modes/RunMode";
import * as format from "../../utils/format";

interface TooltipProps {
  interval: SteadyInterval | RampInterval | FreeInterval;
  mode: WorkoutMode;
  onCadenceChange: (cadence: number | undefined) => void;
}

const Tooltip = ({ mode, ...props }: TooltipProps) => {
  return (
    <TooltipContainer>
      <div>
        <FontAwesomeIcon icon={faClock} fixedWidth />{" "}
        {format.duration(mode.intervalDuration(props.interval))}
      </div>
      {mode instanceof BikeMode ? (
        <BikeData mode={mode} {...props} />
      ) : (
        <RunData mode={mode} {...props} />
      )}
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: -95px;
  left: 0;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  width: 150px;
  border-radius: 5px;
  margin: 5px 0;
  text-align: center;
  font-size: 14px;
  padding: 5px;
`;

function BikeData({
  interval,
  mode,
  onCadenceChange,
}: TooltipProps & { mode: BikeMode }) {
  return (
    <>
      {interval.type === "steady" && (
        <>
          <div>
            <FontAwesomeIcon icon={faBolt} fixedWidth />{" "}
            {format.power(mode.power(interval.intensity))}
          </div>
          <div>
            {format.wkg(mode.wkg(interval.intensity))} &middot;{" "}
            {format.percentage(interval.intensity)} FTP
          </div>
        </>
      )}
      {interval.type === "ramp" && (
        <>
          <div>
            <FontAwesomeIcon icon={faBolt} fixedWidth />{" "}
            {format.power(mode.power(interval.startIntensity))} -{" "}
            {format.power(mode.power(interval.endIntensity))}
          </div>
          <div>
            {format.percentage(interval.startIntensity)} -{" "}
            {format.percentage(interval.endIntensity)} FTP
          </div>
        </>
      )}
      <CadenceRow>
        <CadenceLabel>Cadence</CadenceLabel>
        <CadenceInput
          cadence={interval.cadence}
          onCadenceChange={onCadenceChange}
        />
      </CadenceRow>
    </>
  );
}

function RunData({ interval, mode }: TooltipProps & { mode: RunMode }) {
  return (
    <>
      <div>
        <FontAwesomeIcon icon={faRuler} fixedWidth />{" "}
        {format.distance(mode.intervalDistance(interval))}
      </div>
      {interval.type === "steady" && (
        <>
          <div>
            {format.percentage(interval.intensity)}{" "}
            {format.shortPaceName(interval.pace)}
          </div>
          <div>
            {format.runningPace(mode.speed(interval.intensity, interval.pace))}
          </div>
        </>
      )}
      {interval.type === "ramp" && (
        <>
          <div>
            {format.percentage(interval.startIntensity)} to{" "}
            {format.percentage(interval.endIntensity)}{" "}
            {format.shortPaceName(interval.pace)}
          </div>
          <div>
            {format.runningPace(
              mode.speed(interval.startIntensity, interval.pace)
            )}{" "}
            to{" "}
            {format.runningPace(
              mode.speed(interval.endIntensity, interval.pace)
            )}
          </div>
        </>
      )}
    </>
  );
}

const CadenceRow = styled.div`
  display: flex;
`;

const CadenceLabel = styled.label`
  font-size: 14px;
  flex: 1;
`;

type CadenceInputProps = {
  cadence?: number;
  onCadenceChange: (v: number | undefined) => void;
};

const CadenceInput = styled.input.attrs<CadenceInputProps>((props) => ({
  type: "number",
  min: "40",
  max: "150",
  step: "5",
  value: props.cadence || "",
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onCadenceChange(
      e.target.value ? parseInt(e.target.value) : undefined
    );
  },
  onClick: (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  },
}))<CadenceInputProps>`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 0;
  border-bottom: 0px solid white;
  font-size: 14px;
  min-width: 1px;
  flex: 1;
`;

export default Tooltip;

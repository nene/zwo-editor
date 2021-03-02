import React from "react";
import { Interval } from "../../types/Interval";
import FreeBar from "./FreeBar";
import SteadyBar from "./SteadyBar";
import RampBar from "./RampBar";
import RepetitionBar from "./RepetitionBar";
import { WorkoutMode } from "../../modes/WorkoutMode";
import InstructionItem from "../Instruction/InstructionItem";
import styled from "styled-components";
import { Instruction } from "../../types/Instruction";
import { ZIndex } from "../../types/ZIndex";

interface GenericBarProps {
  interval: Interval;
  mode: WorkoutMode;
  selected: boolean;
  onChange: (interval: Interval) => void;
  onClick: (id: string) => void;
  onInstructionChange: (payload: {
    intervalId: string;
    instruction: Instruction;
  }) => void;
  onInstructionDelete: (payload: {
    intervalId: string;
    instructionId: string;
  }) => void;
}

const GenericBar = (props: GenericBarProps) => {
  return (
    <div>
      <IntervalBar {...props} />
      {props.selected && (
        <InstructionsList
          instructions={props.interval.instructions}
          mode={props.mode}
          width={props.mode.lengthToWidth(
            props.mode.intervalLength(props.interval)
          )}
          onChange={(instruction) =>
            props.onInstructionChange({
              intervalId: props.interval.id,
              instruction,
            })
          }
          onDelete={(instructionId) =>
            props.onInstructionDelete({
              intervalId: props.interval.id,
              instructionId,
            })
          }
        />
      )}
    </div>
  );
};

const InstructionsList: React.FC<{
  instructions: Instruction[];
  mode: WorkoutMode;
  width: number;
  onChange: (instruction: Instruction) => void;
  onDelete: (instructionId: string) => void;
}> = ({ instructions, mode, width, onChange, onDelete }) => (
  <InstructionsWrap>
    {instructions.map((instruction, index) => (
      <InstructionItem
        key={instruction.id}
        instruction={instruction}
        width={width}
        onChange={onChange}
        onDelete={onDelete}
        index={index}
        mode={mode}
      />
    ))}
  </InstructionsWrap>
);

const InstructionsWrap = styled.div`
  position: absolute;
  top: 80px;
  z-index: ${ZIndex.selected};
`;

const IntervalBar = ({
  interval,
  mode,
  selected,
  onChange,
  onClick,
}: GenericBarProps) => {
  switch (interval.type) {
    case "steady":
      return (
        <SteadyBar
          interval={interval}
          mode={mode}
          onChange={onChange}
          onClick={onClick}
          selected={selected}
          showTooltip={true}
        />
      );
    case "ramp":
      return (
        <RampBar
          interval={interval}
          mode={mode}
          onChange={onChange}
          onClick={onClick}
          selected={selected}
        />
      );
    case "free":
      return (
        <FreeBar
          interval={interval}
          mode={mode}
          onChange={onChange}
          onClick={onClick}
          selected={selected}
        />
      );
    case "repetition":
      return (
        <RepetitionBar
          interval={interval}
          mode={mode}
          onChange={onChange}
          onClick={onClick}
          selected={selected}
        />
      );
  }
};

export default GenericBar;

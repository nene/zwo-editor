import React from "react";
import { Interval } from "../../types/Interval";
import FreeBar from "./FreeBar";
import SteadyBar from "./SteadyBar";
import RampBar from "./RampBar";
import RepetitionBar from "./RepetitionBar";
import { WorkoutMode } from "../../modes/WorkoutMode";
import InstructionEditor from "../InstructionEditor/InstructionEditor";
import styled from "styled-components";
import { Instruction } from "../../types/Instruction";

interface GenericBarProps {
  interval: Interval;
  mode: WorkoutMode;
  selected: boolean;
  onChange: (interval: Interval) => void;
  onClick: (id: string) => void;
}

const GenericBar = (props: GenericBarProps) => {
  return (
    <div>
      <IntervalBar {...props} />
      <InstructionsList
        instructions={props.interval.instructions}
        mode={props.mode}
      />
    </div>
  );
};

const InstructionsList: React.FC<{
  instructions: Instruction[];
  mode: WorkoutMode;
}> = ({ instructions, mode }) => (
  <InstructionsWrap>
    {instructions.map((instruction, index) => (
      <InstructionEditor
        key={instruction.id}
        instruction={instruction}
        width={200}
        onChange={() => {}}
        onDelete={() => {}}
        index={index}
        mode={mode}
      />
    ))}
  </InstructionsWrap>
);

const InstructionsWrap = styled.div`
  position: absolute;
  top: 10px;
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

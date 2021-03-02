import React from "react";
import { WorkoutMode } from "../../modes/WorkoutMode";
import InstructionItem from "../Instruction/InstructionItem";
import styled from "styled-components";
import { Instruction } from "../../types/Instruction";
import { ZIndex } from "../../types/ZIndex";

export const InstructionList: React.FC<{
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

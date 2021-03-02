import React, { useState } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { Instruction } from "../../types/Instruction";
import { WorkoutMode } from "../../modes/WorkoutMode";
import { InstructionEditor } from "./InstructionEditor";

interface InstructionItemProps {
  instruction: Instruction;
  width: number;
  onChange: (instruction: Instruction) => void;
  onDelete: (id: string) => void;
  index: number;
  mode: WorkoutMode;
}

const roundingPrecision = { meters: 10, seconds: 5 };

const InstructionItem = (props: InstructionItemProps) => {
  const [xPosition, setXPosition] = useState(
    props.mode.lengthToWidth(props.instruction.offset)
  );

  const [showInput, setShowInput] = useState(false);

  function handleTouch(position: number) {
    props.onChange({
      ...props.instruction,
      offset: props.mode.widthToLength(position, roundingPrecision),
    });
  }

  function handleDragging(position: number) {
    setShowInput(false);
    setXPosition(position);
  }

  return (
    <Draggable
      axis="x"
      handle=".handle"
      defaultPosition={{ x: xPosition, y: (props.index % 5) * 20 }}
      bounds={{ left: 0, right: props.width }}
      scale={1}
      onStop={(e, data) => handleTouch(data.x)}
      onDrag={(e, data) => handleDragging(data.x)}
    >
      <DraggableItem>
        <DragHandle onMouseDown={() => setShowInput(!showInput)} />
        {showInput && (
          <InstructionEditor
            instruction={props.instruction}
            onChange={props.onChange}
            onDelete={props.onDelete}
          />
        )}
        <VerticalLine />
      </DraggableItem>
    </Draggable>
  );
};

const DraggableItem = styled.div`
  position: absolute;
`;

const DragHandle = styled(FontAwesomeIcon).attrs(() => ({
  icon: faComment,
  size: "lg",
  fixedWidth: true,
  className: "handle", // Referenced by Draggable
}))`
  display: block;
  opacity: 0.7;
  &:hover {
    opacity: 0.8;
  }
`;

const VerticalLine = styled.div`
  position: absolute;
  top: 30px;
  left: 0px;
  right: 0;
  height: 90vh;
  width: 1px;
  border-left: 1px dotted gray;
`;

export default InstructionItem;

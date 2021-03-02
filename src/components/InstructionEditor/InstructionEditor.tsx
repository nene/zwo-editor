import React, { useState } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Instruction } from "../../types/Instruction";
import * as format from "../../utils/format";
import { isDuration, Length } from "../../types/Length";
import { WorkoutMode } from "../../modes/WorkoutMode";
import { ZIndex } from "../../types/ZIndex";

interface InstructionEditorProps {
  instruction: Instruction;
  width: number;
  onChange: (instruction: Instruction) => void;
  onDelete: (id: string) => void;
  index: number;
  mode: WorkoutMode;
}

const roundingPrecision = { meters: 10, seconds: 5 };

const InstructionEditor = (props: InstructionEditorProps) => {
  const [text, setText] = useState(props.instruction.text);
  const [xPosition, setXPosition] = useState(
    props.mode.lengthToWidth(props.instruction.offset)
  );

  const [showInput, setShowInput] = useState(false);

  function handleTouch(position: number) {
    props.onChange({
      id: props.instruction.id,
      text: text,
      offset: props.mode.widthToLength(position, roundingPrecision),
    });
  }

  function handleDragging(position: number) {
    setShowInput(false);
    setXPosition(position);
  }

  function handleInputChange(value: string) {
    setText(value);

    props.onChange({
      id: props.instruction.id,
      text: value,
      offset: props.mode.widthToLength(xPosition, roundingPrecision),
    });
  }

  function handleDelete() {
    if (
      text === "" ||
      window.confirm("Are you sure you want to delete this comment?")
    ) {
      props.onDelete(props.instruction.id);
    }
  }

  const renderOffset = (offset: Length): string =>
    isDuration(offset) ? format.duration(offset) : `${offset.meters} m`;

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
          <EditorContainer>
            <DeleteButton onClick={() => handleDelete()} />
            <Offset>{renderOffset(props.instruction.offset)}</Offset>
            <TextEditor
              value={text}
              onChange={(e) => handleInputChange(e.target.value)}
            />
          </EditorContainer>
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

const EditorContainer = styled.div`
  position: relative;
  padding: 5px;
`;

const VerticalLine = styled.div`
  position: absolute;
  top: 30px;
  left: 0px;
  right: 0;
  height: 90vh;
  width: 1px;
  border-left: 1px dotted gray;
  z-index: ${ZIndex.instructionLine};
`;

const Offset = styled.span`
  font-size: 13px;
`;

const TextEditor = styled.textarea`
  display: block;
  padding: 5px;
  width: 250px;
  background-color: white;
`;

const DeleteButton = styled(FontAwesomeIcon).attrs(() => ({
  icon: faTrashAlt,
  fixedWidth: true,
}))`
  color: gray;
  &:hover {
    color: #666;
  }
`;

export default InstructionEditor;

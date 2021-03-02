import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Instruction } from "../../types/Instruction";
import * as format from "../../utils/format";
import { isDuration, Length } from "../../types/Length";

interface InstructionEditorProps {
  instruction: Instruction;
  onChange: (instruction: Instruction) => void;
  onDelete: (id: string) => void;
}

export const InstructionEditor = (props: InstructionEditorProps) => {
  const [text, setText] = useState(props.instruction.text);

  function handleInputChange(value: string) {
    setText(value);

    props.onChange({
      ...props.instruction,
      text: value,
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
    <EditorContainer>
      <DeleteButton onClick={() => handleDelete()} />
      <Offset>{renderOffset(props.instruction.offset)}</Offset>
      <TextEditor
        value={text}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    </EditorContainer>
  );
};

const EditorContainer = styled.div`
  position: relative;
  padding: 5px;
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

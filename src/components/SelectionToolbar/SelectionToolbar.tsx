import React from "react";
import { connect } from "react-redux";
import {
  faTrash,
  faArrowRight,
  faArrowLeft,
  faCopy,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import PaceSelector from "./PaceSelector";
import ActionButton from "../Button/ActionButton";
import { selectSportType } from "../../rdx/state/meta";
import { RootState } from "../../rdx/store";
import {
  removeSelectedInterval,
  duplicateSelectedInterval,
  moveSelectedInterval,
  selectSelectedIntervalPace,
  setSelectedIntervalPace,
  addInstruction,
  selectSelectedIntervalId,
} from "../../rdx/state/intervals";
import { ConnectedProps } from "../../types/ConnectedProps";
import styled from "styled-components";
import { createInstruction } from "../../types/Instruction";
import { selectMode } from "../../rdx/state/mode";
import { ZIndex } from "../../types/ZIndex";

const mapStateToProps = (state: RootState) => ({
  mode: selectMode(state),
  sportType: selectSportType(state),
  selectedIntervalPace: selectSelectedIntervalPace(state),
  selectedIntervalId: selectSelectedIntervalId(state),
});

const mapDispatchToProps = {
  setSelectedIntervalPace,
  removeSelectedInterval,
  duplicateSelectedInterval,
  moveSelectedInterval,
  addInstruction,
};

type SelectionToolbarProps = ConnectedProps<
  typeof mapStateToProps,
  typeof mapDispatchToProps
>;

const SelectionToolbar = (props: SelectionToolbarProps) => {
  const {
    mode,
    sportType,
    selectedIntervalPace,
    selectedIntervalId,
    setSelectedIntervalPace,
    removeSelectedInterval,
    duplicateSelectedInterval,
    moveSelectedInterval,
    addInstruction,
  } = props;

  return (
    <ActionsContainer>
      <ActionButton
        title="Move Left"
        icon={faArrowLeft}
        onClick={() => moveSelectedInterval(-1)}
      />
      <ActionButton
        title="Move Right"
        icon={faArrowRight}
        onClick={() => moveSelectedInterval(+1)}
      />
      <ActionButton
        title="Delete"
        icon={faTrash}
        onClick={removeSelectedInterval}
      />
      <ActionButton
        title="Duplicate"
        icon={faCopy}
        onClick={duplicateSelectedInterval}
      />
      <ActionButton
        title="Add text event"
        icon={faComment}
        onClick={() => {
          selectedIntervalId &&
            addInstruction({
              intervalId: selectedIntervalId,
              instruction: createInstruction({}, mode),
            });
        }}
      />
      {sportType === "run" && (
        <PaceSelector
          value={selectedIntervalPace}
          onChange={setSelectedIntervalPace}
        />
      )}
    </ActionsContainer>
  );
};

const ActionsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  padding: 5px;
  z-index: ${ZIndex.selectionToolbar};
`;

export default connect(mapStateToProps, mapDispatchToProps)(SelectionToolbar);

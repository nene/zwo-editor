import React from "react";
import { connect } from "react-redux";
import {
  faTrash,
  faArrowRight,
  faArrowLeft,
  faCopy,
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
} from "../../rdx/state/intervals";
import { ConnectedProps } from "../../types/ConnectedProps";
import styled from "styled-components";

const mapStateToProps = (state: RootState) => ({
  sportType: selectSportType(state),
  selectedIntervalPace: selectSelectedIntervalPace(state),
});

const mapDispatchToProps = {
  setSelectedIntervalPace,
  removeSelectedInterval,
  duplicateSelectedInterval,
  moveSelectedInterval,
};

type SelectionToolbarProps = ConnectedProps<
  typeof mapStateToProps,
  typeof mapDispatchToProps
>;

const SelectionToolbar = (props: SelectionToolbarProps) => {
  const {
    sportType,
    selectedIntervalPace,
    setSelectedIntervalPace,
    removeSelectedInterval,
    duplicateSelectedInterval,
    moveSelectedInterval,
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
  width: 220px;
  margin: 0 auto;
  padding: 5px;
  z-index: 10;
`;

export default connect(mapStateToProps, mapDispatchToProps)(SelectionToolbar);

import React, { useState } from "react";
import { connect } from "react-redux";
import Popup from "../Popup/Popup";
import Footer from "../Footer/Footer";
import {
  faBiking,
  faRunning,
  faClock,
  faRuler,
} from "@fortawesome/free-solid-svg-icons";
import SaveForm from "../Forms/SaveForm";
import Head from "../Head/Head";
import RunningTimesEditor from "./RunningTimesEditor";
import LeftRightToggle from "./LeftRightToggle";
import Keyboard from "../Keyboard/Keyboard";
import Stats from "./Stats";
import Title from "./Title";
import { SportType } from "../../types/SportType";
import { Duration } from "../../types/Length";
import { LengthType } from "../../types/LengthType";
import {
  selectAuthor,
  selectDescription,
  selectName,
  selectSportType,
  selectLengthType,
  setSportType,
  setLengthType,
} from "../../rdx/state/meta";
import { RootState } from "../../rdx/store";
import {
  selectFtp,
  selectRunningTimes,
  setRunningTimes,
} from "../../rdx/state/athlete";
import {
  selectIntervals,
  adjustSelectedIntervalIntensity,
  adjustSelectedIntervalDuration,
  updateInterval,
  removeSelectedInterval,
  setIntervals,
} from "../../rdx/state/intervals";
import {
  updateInstruction,
  removeInstruction,
  selectInstructions,
  setInstructions,
} from "../../rdx/state/instructions";
import { selectMode } from "../../rdx/state/mode";
import Toolbar from "../Toolbar/Toolbar";
import { ConnectedProps } from "../../types/ConnectedProps";
import { clearSelection, setSelectedId } from "../../rdx/state/selectedId";
import Editor from "../Editor/Editor";
import styled from "styled-components";

const mapStateToProps = (state: RootState) => ({
  name: selectName(state),
  author: selectAuthor(state),
  description: selectDescription(state),
  sportType: selectSportType(state),
  lengthType: selectLengthType(state),
  ftp: selectFtp(state),
  runningTimes: selectRunningTimes(state),
  intervals: selectIntervals(state),
  instructions: selectInstructions(state),
  mode: selectMode(state),
});

const mapDispatchToProps = {
  setSportType,
  setLengthType,
  setRunningTimes,
  setIntervals,
  setInstructions,
  adjustSelectedIntervalIntensity,
  adjustSelectedIntervalDuration,
  updateInterval,
  updateInstruction,
  setSelectedId,
  clearSelection,
  removeSelectedInterval,
  removeInstruction,
};

type EditorPageProps = ConnectedProps<
  typeof mapStateToProps,
  typeof mapDispatchToProps
>;

const EditorPage = ({
  name,
  author,
  description,
  sportType,
  lengthType,
  ftp,
  runningTimes,
  intervals,
  instructions,
  mode,
  setSportType,
  setLengthType,
  setRunningTimes,
  setIntervals,
  setInstructions,
  adjustSelectedIntervalIntensity,
  adjustSelectedIntervalDuration,
  removeSelectedInterval,
}: EditorPageProps) => {
  const [savePopupIsVisile, setSavePopupVisibility] = useState(false);

  const isEmpty = () => intervals.length === 0 && instructions.length === 0;

  function switchSportType(newSportType: SportType) {
    if (
      isEmpty() ||
      window.confirm(
        `Switching from ${sportType} to ${newSportType} will clear current workout. Are you sure?`
      )
    ) {
      setIntervals([]);
      setInstructions([]);
      setSportType(newSportType);
    }
  }

  function switchLengthType(newLengthType: LengthType) {
    if (
      isEmpty() ||
      window.confirm(
        `Switching from ${lengthType} to ${newLengthType} will clear current workout. Are you sure?`
      )
    ) {
      setIntervals([]);
      setInstructions([]);
      setLengthType(newLengthType);
    }
  }

  return (
    <KeyboardContainer
      onBackspacePress={removeSelectedInterval}
      onUpPress={() => adjustSelectedIntervalIntensity(0.01)}
      onDownPress={() => adjustSelectedIntervalIntensity(-0.01)}
      onLeftPress={() => adjustSelectedIntervalDuration(Duration(-5))}
      onRightPress={() => adjustSelectedIntervalDuration(Duration(5))}
    >
      <Head name={name} description={description} />

      {savePopupIsVisile && (
        <Popup width="500px" onClose={() => setSavePopupVisibility(false)}>
          <SaveForm />
        </Popup>
      )}
      <Header>
        <Title
          name={name}
          author={author}
          description={description}
          onClick={() => setSavePopupVisibility(true)}
        />
        <HeaderRight>
          <Stats intervals={intervals} ftp={ftp} mode={mode} />
          {sportType === "run" && (
            <LeftRightToggle<"time", "distance">
              label="Duration Type"
              leftValue="time"
              rightValue="distance"
              leftIcon={faClock}
              rightIcon={faRuler}
              selected={lengthType}
              onChange={switchLengthType}
            />
          )}
          <LeftRightToggle<"bike", "run">
            label="Sport Type"
            leftValue="bike"
            rightValue="run"
            leftIcon={faBiking}
            rightIcon={faRunning}
            selected={sportType}
            onChange={switchSportType}
          />
        </HeaderRight>
      </Header>
      {sportType === "run" && (
        <RunningTimesEditor times={runningTimes} onChange={setRunningTimes} />
      )}

      <Editor />

      <Toolbar />
      <Footer />
    </KeyboardContainer>
  );
};

const KeyboardContainer = styled(Keyboard)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  margin: 0px;
  background-color: #eaeaea;
  overflow-x: hidden;
`;

const Header = styled.div`
  margin: 0 auto;
  text-align: left;
  max-width: 1360px;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const HeaderRight = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
`;

export default connect(mapStateToProps, mapDispatchToProps)(EditorPage);

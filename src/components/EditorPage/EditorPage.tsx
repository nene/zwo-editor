import React, { useState } from 'react';
import { connect } from 'react-redux';
import './EditorPage.css';
import Popup from '../Popup/Popup';
import Footer from '../Footer/Footer';
import { faBiking, faRunning, faClock, faRuler } from '@fortawesome/free-solid-svg-icons';
import SaveForm from '../Forms/SaveForm';
import Head from '../Head/Head';
import RunningTimesEditor from './RunningTimesEditor';
import LeftRightToggle from './LeftRightToggle';
import Keyboard from '../Keyboard/Keyboard';
import Stats from './Stats';
import Title from './Title';
import { SportType } from '../../types/SportType';
import { Duration } from '../../types/Length';
import { LengthType } from '../../types/LengthType';
import { selectAuthor, selectDescription, selectName, selectSportType, selectLengthType, setSportType, setLengthType } from '../../rdx/state/meta';
import { RootState } from '../../rdx/store';
import { selectFtp, selectRunningTimes, setRunningTimes } from '../../rdx/state/athlete';
import { selectIntervals, adjustSelectedIntervalIntensity, adjustSelectedIntervalDuration, updateInterval, removeSelectedInterval } from '../../rdx/state/intervals';
import { updateInstruction, removeInstruction } from '../../rdx/state/instructions';
import { selectMode } from '../../rdx/state/mode';
import { clearWorkout } from '../../rdx/state/workout';
import Toolbar from '../Toolbar/Toolbar';
import { ConnectedProps } from '../../types/ConnectedProps';
import { clearSelection, setSelectedId } from '../../rdx/state/selectedId';
import Editor from '../Editor/Editor';

const mapStateToProps = (state: RootState) => ({
  name: selectName(state),
  author: selectAuthor(state),
  description: selectDescription(state),
  sportType: selectSportType(state),
  lengthType: selectLengthType(state),
  ftp: selectFtp(state),
  runningTimes: selectRunningTimes(state),
  intervals: selectIntervals(state),
  mode: selectMode(state),
});

const mapDispatchToProps = {
  setSportType,
  setLengthType,
  setRunningTimes,
  clearWorkout,
  adjustSelectedIntervalIntensity,
  adjustSelectedIntervalDuration,
  updateInterval,
  updateInstruction,
  setSelectedId,
  clearSelection,
  removeSelectedInterval,
  removeInstruction,
};

type EditorPageProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

const EditorPage = ({
  name,
  author,
  description,
  sportType,
  lengthType,
  ftp,
  runningTimes,
  intervals,
  mode,
  setSportType,
  setLengthType,
  setRunningTimes,
  clearWorkout,
  adjustSelectedIntervalIntensity,
  adjustSelectedIntervalDuration,
  removeSelectedInterval,
}: EditorPageProps) => {
  const [savePopupIsVisile, setSavePopupVisibility] = useState(false);

  function switchSportType(newSportType: SportType) {
    if (window.confirm(`Switching from ${sportType} to ${newSportType} will clear current workout. Are you sure?`)) {
      clearWorkout();
      setSportType(newSportType);
    }
  }

  function switchLengthType(newLengthType: LengthType) {
    if (window.confirm(`Switching from ${lengthType} to ${newLengthType} will clear current workout. Are you sure?`)) {
      clearWorkout();
      setLengthType(newLengthType);
    }
  }

  return (
    <Keyboard
      className="container"
      onBackspacePress={removeSelectedInterval}
      onUpPress={() => adjustSelectedIntervalIntensity(0.01)}
      onDownPress={() => adjustSelectedIntervalIntensity(-0.01)}
      onLeftPress={() => adjustSelectedIntervalDuration(new Duration(-5))}
      onRightPress={() => adjustSelectedIntervalDuration(new Duration(5))}
    >
      <Head name={name} description={description} />

      {savePopupIsVisile &&
        <Popup width="500px" onClose={() => setSavePopupVisibility(false)}>
          <SaveForm />
        </Popup>
      }
      <div className="info">
        <Title name={name} author={author} description={description} onClick={() => setSavePopupVisibility(true)} />
        <div className="workout">
          <Stats intervals={intervals} ftp={ftp} mode={mode} />
          {sportType === 'run' &&
            <LeftRightToggle<"time","distance">
              label="Duration Type"
              leftValue="time"
              rightValue="distance"
              leftIcon={faClock}
              rightIcon={faRuler}
              selected={lengthType}
              onChange={switchLengthType}
            />
          }
          <LeftRightToggle<"bike","run">
            label="Sport Type"
            leftValue="bike"
            rightValue="run"
            leftIcon={faBiking}
            rightIcon={faRunning}
            selected={sportType}
            onChange={switchSportType}
          />
        </div>
      </div>
      {sportType === "run" && <RunningTimesEditor times={runningTimes} onChange={setRunningTimes} />}

      <Editor />

      <Toolbar />
      <Footer />
    </Keyboard>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorPage);

import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import './Editor.css'
import GenericBar from '../Bar/GenericBar'
import InstructionEditor from '../InstructionEditor/InstructionEditor'
import Popup from '../Popup/Popup'
import Footer from '../Footer/Footer'
import TimeAxis from '../Axis/TimeAxis'
import ZoneAxis from '../Axis/ZoneAxis'
import { faTrash, faArrowRight, faArrowLeft, faCopy, faBiking, faRunning, faClock, faRuler } from '@fortawesome/free-solid-svg-icons'
import SaveForm from '../Forms/SaveForm'
import Head from '../Head/Head'
import RunningTimesEditor from './RunningTimesEditor'
import LeftRightToggle from './LeftRightToggle'
import { PaceType } from '../../types/PaceType'
import PaceSelector from './PaceSelector'
import { Interval } from '../../types/Interval'
import { Instruction } from '../../types/Instruction'
import { moveInterval } from '../../interval/intervalUtils'
import Keyboard from '../Keyboard/Keyboard'
import Stats from './Stats'
import Title from './Title'
import ActionButton from '../Button/ActionButton'
import { SportType } from '../../types/SportType'
import { workoutDuration } from '../../utils/duration'
import { Duration } from '../../types/Length'
import DistanceAxis from '../Axis/DistanceAxis'
import { LengthType } from '../../types/LengthType'
import { selectAuthor, selectDescription, selectName, selectSportType, selectLengthType, setSportType, setLengthType } from '../../rdx/state/meta'
import { RootState } from '../../rdx/store';
import { selectFtp, selectRunningTimes, setRunningTimes } from '../../rdx/state/athlete';
import { selectIntervals, setIntervals, adjustSelectedIntervalIntensity, adjustSelectedIntervalDuration, updateInterval, removeSelectedInterval, duplicateSelectedInterval } from '../../rdx/state/intervals';
import { selectInstructions, updateInstruction, removeInstruction } from '../../rdx/state/instructions';
import { selectMode } from '../../rdx/state/mode';
import { clearWorkout } from '../../rdx/state/workout';
import Toolbar from '../Toolbar/Toolbar';
import { ConnectedProps } from '../../types/ConnectedProps';
import { selectSelectedId, clearSelection, setSelectedId } from '../../rdx/state/selectedId';

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
  selectedId: selectSelectedId(state),
});

const mapDispatchToProps = {
  setSportType,
  setLengthType,
  setRunningTimes,
  setIntervals,
  clearWorkout,
  adjustSelectedIntervalIntensity,
  adjustSelectedIntervalDuration,
  updateInterval,
  updateInstruction,
  setSelectedId,
  clearSelection,
  removeSelectedInterval,
  duplicateSelectedInterval,
  removeInstruction,
};

type EditorProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

const Editor = (props: EditorProps) => {
  const {name} = props;
  const {description} = props;
  const {author} = props;
  const {sportType, setSportType} = props;
  const {lengthType, setLengthType} = props;

  const {intervals, setIntervals} = props;
  const {instructions} = props;

  const {ftp} = props;
  const {runningTimes, setRunningTimes} = props;

  const {mode} = props;
  const {
    clearWorkout,
    adjustSelectedIntervalIntensity,
    adjustSelectedIntervalDuration,
    updateInterval,
    updateInstruction,
    removeSelectedInterval,
    duplicateSelectedInterval,
    removeInstruction,
  } = props;

  const {selectedId, setSelectedId, clearSelection} = props;

  const [savePopupIsVisile, setSavePopupVisibility] = useState(false)

  const canvasRef = useRef<HTMLInputElement>(null);
  const segmentsRef = useRef<HTMLInputElement>(null);
  const [xAxisWidth, setXAxisWidth] = useState(1320);

  useEffect(() => {
    setXAxisWidth(segmentsRef.current?.scrollWidth || 1320)
  }, [segmentsRef])

  function toggleSelection(id: string) {
    if (id === selectedId) {
      clearSelection()
    } else {
      setSelectedId(id)
    }
  }

  const renderInterval = (interval: Interval) => {
    return (
      <GenericBar
        key={interval.id}
        interval={interval}
        mode={mode}
        onChange={updateInterval}
        onClick={toggleSelection}
        selected={interval.id === selectedId}
      />
    );
  }

  const renderInstruction = (instruction: Instruction, index: number) => (
    <InstructionEditor
      key={instruction.id}
      instruction={instruction}
      width={workoutDuration(intervals, mode).seconds / 3}
      onChange={updateInstruction}
      onDelete={removeInstruction}
      index={index}
      mode={mode}
    />
  )

  function setPace(pace: PaceType, id: string) {
    const index = intervals.findIndex(interval => interval.id === id)

    if (index !== -1) {
      const updatedArray = [...intervals]
      const interval = updatedArray[index]
      if (interval.type !== 'steady') { // TODO: Only steady?
        return;
      }
      interval.pace = pace
      setIntervals(updatedArray)
    }
  }

  function getPace(id: string): PaceType | undefined {
    const index = intervals.findIndex(interval => interval.id === id)

    if (index !== -1) {
      const interval = intervals[index]
      return interval.type === 'free' ? undefined : interval.pace
    }
  }

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
        <Popup width="500px" dismiss={() => setSavePopupVisibility(false)}>
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

      <div id="editor" className='editor'>
        {selectedId &&
          <div className='actions'>
            <ActionButton title='Move Left' icon={faArrowLeft} onClick={() => selectedId && setIntervals(moveInterval(selectedId, -1, intervals))} />
            <ActionButton title='Move Right' icon={faArrowRight} onClick={() => selectedId && setIntervals(moveInterval(selectedId, +1, intervals))} />
            <ActionButton title='Delete' icon={faTrash} onClick={removeSelectedInterval} />
            <ActionButton title='Duplicate' icon={faCopy} onClick={duplicateSelectedInterval} />
            {sportType === "run" &&
              <PaceSelector value={getPace(selectedId)} onChange={(pace) => setPace(pace, selectedId)} />
            }
          </div>
        }
        <div className='canvas' ref={canvasRef}>          
          {selectedId &&
            <div className='fader' style={{width: canvasRef.current?.scrollWidth}} onClick={() => clearSelection()}></div>
          }
          <div className='segments' ref={segmentsRef}>
            {intervals.map(renderInterval)}
          </div>

          <div className='slider'>
            {instructions.map((instruction, index) => renderInstruction(instruction, index))}
          </div>

          {lengthType === "time" ? <TimeAxis width={xAxisWidth} /> : <DistanceAxis width={xAxisWidth} />}
        </div>
        <ZoneAxis />
      </div>
      <Toolbar />
      <Footer />
    </Keyboard>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)

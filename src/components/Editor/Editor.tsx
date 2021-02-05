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
import intervalFactory from '../../interval/intervalFactory'
import { moveInterval, updateIntervalDuration } from '../../interval/intervalUtils'
import Keyboard from '../Keyboard/Keyboard'
import Stats from './Stats'
import Title from './Title'
import ActionButton from '../Button/ActionButton'
import { SportType } from '../../types/SportType'
import { workoutDuration } from '../../utils/duration'
import { Duration } from '../../types/Length'
import DistanceAxis from '../Axis/DistanceAxis'
import { LengthType } from '../../types/LengthType'
import { selectAuthor, selectDescription, selectName, setName, setAuthor, setDescription, selectTags, setTags, selectSportType, selectLengthType, setSportType, setLengthType } from '../../rdx/meta'
import { RootState } from '../../rdx/store';
import { selectFtp, selectRunningTimes, setRunningTimes } from '../../rdx/athlete';
import { RunningTimes } from '../../types/RunningTimes';
import { addInterval, selectIntervals, setIntervals, adjustIntensity, updateInterval } from '../../rdx/intervals';
import { selectInstructions, setInstructions, updateInstruction } from '../../rdx/instructions';
import { WorkoutMode } from '../../modes/WorkoutMode';
import { selectMode } from '../../rdx/mode';
import { clearWorkout } from '../../rdx/workout';
import Toolbar from '../Toolbar/Toolbar';

interface EditorProps {
  name: string;
  author: string;
  description: string;
  tags: string[];
  sportType: SportType;
  lengthType: LengthType;
  ftp: number;
  runningTimes: RunningTimes;
  intervals: Interval[];
  instructions: Instruction[];
  mode: WorkoutMode,
  setName: (name: string) => void;
  setAuthor: (author: string) => void;
  setDescription: (description: string) => void;
  setTags: (tags: string[]) => void;
  setSportType: (sportType: SportType) => void;
  setLengthType: (sportType: LengthType) => void;
  setRunningTimes: (runningTimes: RunningTimes) => void;
  setIntervals: (intervals: Interval[]) => void;
  addInterval: (interval: Interval) => void;
  setInstructions: (instructions: Instruction[]) => void;
  clearWorkout: () => void;
  adjustIntensity: (payload: {id: string, amount: number}) => void;
  updateInterval: (interval: Interval) => void;
  updateInstruction: (instruction: Instruction) => void;
}

const Editor = (props: EditorProps) => {
  const {name, setName} = props;
  const {description, setDescription} = props;
  const {author, setAuthor} = props;
  const {tags, setTags} = props;
  const {sportType, setSportType} = props;
  const {lengthType, setLengthType} = props;

  const {intervals, setIntervals} = props;
  const {instructions, setInstructions} = props;

  const {ftp} = props;
  const {runningTimes, setRunningTimes} = props;

  const {mode} = props;
  const {addInterval, clearWorkout, adjustIntensity, updateInterval, updateInstruction} = props;

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const [savePopupIsVisile, setSavePopupVisibility] = useState(false)

  const canvasRef = useRef<HTMLInputElement>(null);
  const segmentsRef = useRef<HTMLInputElement>(null);
  const [xAxisWidth, setXAxisWidth] = useState(1320);

  useEffect(() => {
    setXAxisWidth(segmentsRef.current?.scrollWidth || 1320)
  }, [segmentsRef])

  function toggleSelection(id: string) {
    if (id === selectedId) {
      setSelectedId(undefined)
    } else {
      setSelectedId(id)
    }
  }

  function deleteInstruction(id: string) {
    setInstructions(instructions.filter(item => item.id !== id))
  }

  function removeInterval(id: string) {
    setIntervals(intervals.filter(item => item.id !== id))
    setSelectedId(undefined)
  }

  function duplicateInterval(id: string) {
    const interval = intervals.find(interval => interval.id === id)
    if (interval) {
      addInterval(intervalFactory.clone(interval));
    }
    setSelectedId(undefined)
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
      onDelete={deleteInstruction}
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
      onBackspacePress={() => selectedId && removeInterval(selectedId)}
      onUpPress={() => selectedId && adjustIntensity({id: selectedId, amount: 0.01})}
      onDownPress={() => selectedId && adjustIntensity({id: selectedId, amount: -0.01})}
      onLeftPress={() => selectedId && setIntervals(updateIntervalDuration(selectedId, new Duration(-5), intervals, mode))}
      onRightPress={() => selectedId && setIntervals(updateIntervalDuration(selectedId, new Duration(5), intervals, mode))}
    >
      <Head name={name} description={description} />

      {savePopupIsVisile &&
        <Popup width="500px" dismiss={() => setSavePopupVisibility(false)}>
          <SaveForm
            name={name}
            description={description}
            author={author}
            tags={tags}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onAuthorChange={setAuthor}
            onTagsChange={setTags}
          />
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
            <ActionButton title='Delete' icon={faTrash} onClick={() => selectedId && removeInterval(selectedId)} />
            <ActionButton title='Duplicate' icon={faCopy} onClick={() => selectedId && duplicateInterval(selectedId)} />
            {sportType === "run" &&
              <PaceSelector value={getPace(selectedId)} onChange={(pace) => setPace(pace, selectedId)} />
            }
          </div>
        }
        <div className='canvas' ref={canvasRef}>          
          {selectedId &&
            <div className='fader' style={{width: canvasRef.current?.scrollWidth}} onClick={() => setSelectedId(undefined)}></div>
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

const mapStateToProps = (state: RootState) => ({
  name: selectName(state),
  author: selectAuthor(state),
  description: selectDescription(state),
  tags: selectTags(state),
  sportType: selectSportType(state),
  lengthType: selectLengthType(state),
  ftp: selectFtp(state),
  runningTimes: selectRunningTimes(state),
  intervals: selectIntervals(state),
  instructions: selectInstructions(state),
  mode: selectMode(state),
});

const mapDispatchToProps = {
  setName,
  setAuthor,
  setDescription,
  setTags,
  setSportType,
  setLengthType,
  setRunningTimes,
  setIntervals,
  addInterval,
  setInstructions,
  clearWorkout,
  adjustIntensity,
  updateInterval,
  updateInstruction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor)

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux';
import './Editor.css'
import { ZoneColor, Zones } from '../../types/Zones'
import GenericBar from '../Bar/GenericBar'
import InstructionEditor from '../InstructionEditor/InstructionEditor'
import Popup from '../Popup/Popup'
import Footer from '../Footer/Footer'
import TimeAxis from '../Axis/TimeAxis'
import ZoneAxis from '../Axis/ZoneAxis'
import { faTrash, faArrowRight, faArrowLeft, faFile, faDownload, faComment, faBicycle, faCopy, faBiking, faRunning, faClock, faRuler } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as WarmdownLogo } from '../../assets/warmdown.svg'
import { ReactComponent as WarmupLogo } from '../../assets/warmup.svg'
import { ReactComponent as IntervalLogo } from '../../assets/interval.svg'
import { ReactComponent as SteadyLogo } from '../../assets/steady.svg'
import SaveForm from '../Forms/SaveForm'
import Head from '../Head/Head'
import RunningTimesEditor from './RunningTimesEditor'
import LeftRightToggle from './LeftRightToggle'
import createWorkoutXml from '../../xml/createWorkoutXml'
import { PaceType } from '../../types/PaceType'
import PaceSelector from './PaceSelector'
import { Interval } from '../../types/Interval'
import { createInstruction, Instruction } from '../../types/Instruction'
import intervalFactory from '../../interval/intervalFactory'
import parseWorkoutXml from '../../xml/parseWorkoutXml'
import { createEmptyWorkout, Workout } from '../../types/Workout'
import { moveInterval, updateIntervalDuration, updateIntervalIntensity } from '../../interval/intervalUtils'
import Keyboard from '../Keyboard/Keyboard'
import Stats from './Stats'
import Title from './Title'
import NumberField from './NumberField'
import UploadButton from '../Button/UploadButton'
import IconButton from '../Button/IconButton'
import ColorButton from '../Button/ColorButton'
import Button from '../Button/Button'
import ActionButton from '../Button/ActionButton'
import * as storage from '../../storage/storage';
import { SportType } from '../../types/SportType'
import createMode from '../../modes/createMode'
import { workoutDuration } from '../../utils/duration'
import { Duration } from '../../types/Length'
import DistanceAxis from '../Axis/DistanceAxis'
import { LengthType } from '../../types/LengthType'
import { selectAuthor, selectDescription, selectName, setName, setAuthor, setDescription, selectTags, setTags, selectSportType, selectLengthType, setSportType, setLengthType } from '../../rdx/workout'
import { RootState } from '../../rdx/store';
import { selectFtp, selectRunningTimes, selectWeight, setFtp, setRunningTimes, setWeight } from '../../rdx/athlete';
import { RunningTimes } from '../../types/RunningTimes';
import { selectIntervals, setIntervals } from '../../rdx/intervals';

interface EditorProps {
  name: string;
  author: string;
  description: string;
  tags: string[];
  sportType: SportType;
  lengthType: LengthType;
  ftp: number;
  weight: number;
  runningTimes: RunningTimes;
  intervals: Interval[];
  setName: (name: string) => void;
  setAuthor: (author: string) => void;
  setDescription: (description: string) => void;
  setTags: (tags: string[]) => void;
  setSportType: (sportType: SportType) => void;
  setLengthType: (sportType: LengthType) => void;
  setFtp: (ftp: number) => void;
  setWeight: (weight: number) => void;
  setRunningTimes: (runningTimes: RunningTimes) => void;
  setIntervals: (intervals: Interval[]) => void;
}

const Editor = (props: EditorProps) => {
  const {name, setName} = props;
  const {description, setDescription} = props;
  const {author, setAuthor} = props;
  const {tags, setTags} = props;
  const {sportType, setSportType} = props;
  const {lengthType, setLengthType} = props;

  const {intervals, setIntervals} = props;
  const [instructions, setInstructions] = useState(storage.getInstructions())

  const {ftp, setFtp} = props;
  const {weight, setWeight} = props;
  const {runningTimes, setRunningTimes} = props;

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const [savePopupIsVisile, setSavePopupVisibility] = useState(false)

  const canvasRef = useRef<HTMLInputElement>(null);
  const segmentsRef = useRef<HTMLInputElement>(null);
  const [xAxisWidth, setXAxisWidth] = useState(1320);

  const getMode = useCallback(() => {
    return createMode({sportType, ftp, weight, runningTimes, lengthType});
  }, [sportType, ftp, weight, runningTimes, lengthType]);

  useEffect(() => {
    storage.setInstructions(instructions)

    setXAxisWidth(segmentsRef.current?.scrollWidth || 1320)
  }, [segmentsRef, instructions])

  function loadWorkout(workout: Workout) {
    setSportType(workout.sportType)
    setLengthType(workout.lengthType)
    setAuthor(workout.author)
    setName(workout.name)
    setDescription(workout.description)
    setIntervals(workout.intervals)
    setInstructions(workout.instructions)
    setTags(workout.tags)
  }

  function newWorkout() {
    loadWorkout(createEmptyWorkout(sportType, lengthType))
  }

  function updateInterval(updatedInterval: Interval) {
    const index = intervals.findIndex(interval => interval.id === updatedInterval.id)

    const updatedArray = [...intervals]
    updatedArray[index] = updatedInterval

    setIntervals(updatedArray)
  }

  function toggleSelection(id: string) {
    if (id === selectedId) {
      setSelectedId(undefined)
    } else {
      setSelectedId(id)
    }
  }

  function addInterval(interval: Interval) {
    setIntervals([...intervals, interval]);
  }

  function addInstruction(instruction: Instruction) {
    setInstructions(instructions => [...instructions, instruction]);
  }

  function updateInstruction(instruction: Instruction) {
    const index = instructions.findIndex(instructions => instructions.id === instruction.id)

    const updatedArray = [...instructions]
    updatedArray[index] = instruction
    setInstructions(updatedArray)
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

  function createZwoFile() {
    const xml = createWorkoutXml({
      author,
      name,
      description,
      sportType,
      lengthType,
      tags,
      intervals,
      instructions,
    }, getMode());

    return new Blob([xml], { type: 'application/xml' })
  }

  function downloadWorkout() {
    const tempFile = createZwoFile()
    const url = window.URL.createObjectURL(tempFile)

    var a = document.createElement("a")
    document.body.appendChild(a)
    a.style.display = "none"
    a.href = url
    a.download = `workout.zwo`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  async function handleUpload(file: Blob) {
    // ask user if they want to overwrite current workout first
    if (intervals.length > 0) {
      if (!window.confirm('Are you sure you want to create a new workout?')) {
        return false
      }
    }

    newWorkout()

    try {
      loadWorkout(parseWorkoutXml(await file.text(), getMode()));
    } catch (e) {
      console.error(e);
    }
  }

  const renderInterval = (interval: Interval) => {
    return (
      <GenericBar
        key={interval.id}
        interval={interval}
        mode={getMode()}
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
      width={workoutDuration(intervals, getMode()).seconds / 3}
      onChange={updateInstruction}
      onDelete={deleteInstruction}
      index={index}
      mode={getMode()}
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
      newWorkout();
      setSportType(newSportType);
    }
  }

  function switchLengthType(newLengthType: LengthType) {
    if (window.confirm(`Switching from ${lengthType} to ${newLengthType} will clear current workout. Are you sure?`)) {
      newWorkout();
      setLengthType(newLengthType);
    }
  }

  return (
    <Keyboard
      className="container"
      onBackspacePress={() => selectedId && removeInterval(selectedId)}
      onUpPress={() => selectedId && setIntervals(updateIntervalIntensity(selectedId, 0.01, intervals))}
      onDownPress={() => selectedId && setIntervals(updateIntervalIntensity(selectedId, -0.01, intervals))}
      onLeftPress={() => selectedId && setIntervals(updateIntervalDuration(selectedId, new Duration(-5), intervals, getMode()))}
      onRightPress={() => selectedId && setIntervals(updateIntervalDuration(selectedId, new Duration(5), intervals, getMode()))}
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
          <Stats intervals={intervals} ftp={ftp} mode={getMode()} />
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
      <div className='cta'>
        {sportType === "bike" ?
          <div>
            <ColorButton label="Z1" color={ZoneColor.GRAY} onClick={() => addInterval(intervalFactory.steady({ intensity: 0.5 }, getMode()))} />
            <ColorButton label="Z2" color={ZoneColor.BLUE} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z2.min }, getMode()))} />
            <ColorButton label="Z3" color={ZoneColor.GREEN} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z3.min }, getMode()))} />
            <ColorButton label="Z4" color={ZoneColor.YELLOW} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z4.min }, getMode()))} />
            <ColorButton label="Z5" color={ZoneColor.ORANGE} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z5.min }, getMode()))} />
            <ColorButton label="Z6" color={ZoneColor.RED} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z6.min }, getMode()))} />
          </div>
          :
          <Button onClick={() => addInterval(intervalFactory.steady({}, getMode()))}><SteadyLogo className="btn-icon" /> Steady Pace</Button>
        }

        <Button onClick={() => addInterval(intervalFactory.ramp({ startIntensity: 0.25, endIntensity: 0.75 }, getMode()))}><WarmupLogo className="btn-icon" /> Warm up</Button>
        <Button onClick={() => addInterval(intervalFactory.ramp({ startIntensity: 0.75, endIntensity: 0.25 }, getMode()))}><WarmdownLogo className="btn-icon" /> Cool down</Button>
        <Button onClick={() => addInterval(intervalFactory.repetition({}, getMode()))}><IntervalLogo className="btn-icon" /> Interval</Button>
        {sportType === "bike" &&
          <IconButton label="Free Ride" icon={faBicycle} onClick={() => addInterval(intervalFactory.free({}, getMode()))} />
        }
        <IconButton label="Text Event" icon={faComment} onClick={() => addInstruction(createInstruction({}, getMode()))} />
        {sportType === "bike" &&
          <NumberField name="ftp" label={"FTP (W)"} value={ftp} onChange={setFtp} />
        }
        {sportType === "bike" &&
          <NumberField name="weight" label={"Body Weight (kg)"} value={weight} onChange={setWeight} />
        }
        <IconButton label="New" icon={faFile} onClick={() => { if (window.confirm('Are you sure you want to create a new workout?')) newWorkout() }} />
        <IconButton label="Download" icon={faDownload} onClick={downloadWorkout} />
        <UploadButton onUpload={handleUpload} />
      </div>
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
  weight: selectWeight(state),
  runningTimes: selectRunningTimes(state),
  intervals: selectIntervals(state),
});

const mapDispatchToProps = {
  setName,
  setAuthor,
  setDescription,
  setTags,
  setSportType,
  setLengthType,
  setFtp,
  setWeight,
  setRunningTimes,
  setIntervals,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor)

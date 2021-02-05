import React from 'react'
import { connect } from 'react-redux';
import { ZoneColor, Zones } from '../../types/Zones'
import { faFile, faDownload, faComment, faBicycle } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as WarmdownLogo } from '../../assets/warmdown.svg'
import { ReactComponent as WarmupLogo } from '../../assets/warmup.svg'
import { ReactComponent as IntervalLogo } from '../../assets/interval.svg'
import { ReactComponent as SteadyLogo } from '../../assets/steady.svg'
import createWorkoutXml from '../../xml/createWorkoutXml'
import { Interval } from '../../types/Interval'
import { createInstruction, Instruction } from '../../types/Instruction'
import intervalFactory from '../../interval/intervalFactory'
import parseWorkoutXml from '../../xml/parseWorkoutXml'
import { Workout } from '../../types/Workout'
import NumberField from '../Editor/NumberField'
import UploadButton from '../Button/UploadButton'
import IconButton from '../Button/IconButton'
import ColorButton from '../Button/ColorButton'
import Button from '../Button/Button'
import { SportType } from '../../types/SportType'
import { LengthType } from '../../types/LengthType'
import { selectAuthor, selectDescription, selectName, selectTags, selectSportType, selectLengthType } from '../../rdx/meta'
import { RootState } from '../../rdx/store';
import { selectFtp, selectWeight, setFtp, setWeight } from '../../rdx/athlete';
import { addInterval, selectIntervals } from '../../rdx/intervals';
import { addInstruction, selectInstructions } from '../../rdx/instructions';
import { WorkoutMode } from '../../modes/WorkoutMode';
import { selectMode } from '../../rdx/mode';
import { clearWorkout, loadWorkout } from '../../rdx/workout';

interface ToolbarProps {
  name: string;
  author: string;
  description: string;
  tags: string[];
  sportType: SportType;
  lengthType: LengthType;
  ftp: number;
  weight: number;
  intervals: Interval[];
  instructions: Instruction[];
  mode: WorkoutMode,
  setFtp: (ftp: number) => void;
  setWeight: (weight: number) => void;
  addInterval: (interval: Interval) => void;
  addInstruction: (instruction: Instruction) => void;
  clearWorkout: () => void;
  loadWorkout: (workout: Workout) => void;
}

const Toolbar = ({mode, addInterval, addInstruction, ...props}: ToolbarProps) => {
  function createZwoFile() {
    const xml = createWorkoutXml({
      author: props.author,
      name: props.name,
      description: props.description,
      sportType: props.sportType,
      lengthType: props.lengthType,
      tags: props.tags,
      intervals: props.intervals,
      instructions: props.instructions,
    }, mode);

    return new Blob([xml], { type: 'application/xml' });
  }

  function downloadWorkout() {
    const tempFile = createZwoFile();
    const url = window.URL.createObjectURL(tempFile);

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = `workout.zwo`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async function handleUpload(file: Blob) {
    // ask user if they want to overwrite current workout first
    if (props.intervals.length > 0) {
      if (!window.confirm('Are you sure you want to create a new workout?')) {
        return false;
      }
    }

    props.clearWorkout();

    try {
      props.loadWorkout(parseWorkoutXml(await file.text(), mode));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className='cta'>
      {props.sportType === "bike" ?
        <div>
          <ColorButton label="Z1" color={ZoneColor.GRAY} onClick={() => addInterval(intervalFactory.steady({ intensity: 0.5 }, mode))} />
          <ColorButton label="Z2" color={ZoneColor.BLUE} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z2.min }, mode))} />
          <ColorButton label="Z3" color={ZoneColor.GREEN} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z3.min }, mode))} />
          <ColorButton label="Z4" color={ZoneColor.YELLOW} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z4.min }, mode))} />
          <ColorButton label="Z5" color={ZoneColor.ORANGE} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z5.min }, mode))} />
          <ColorButton label="Z6" color={ZoneColor.RED} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z6.min }, mode))} />
        </div>
        :
        <Button onClick={() => addInterval(intervalFactory.steady({}, mode))}><SteadyLogo className="btn-icon" /> Steady Pace</Button>
      }

      <Button onClick={() => addInterval(intervalFactory.ramp({ startIntensity: 0.25, endIntensity: 0.75 }, mode))}><WarmupLogo className="btn-icon" /> Warm up</Button>
      <Button onClick={() => addInterval(intervalFactory.ramp({ startIntensity: 0.75, endIntensity: 0.25 }, mode))}><WarmdownLogo className="btn-icon" /> Cool down</Button>
      <Button onClick={() => addInterval(intervalFactory.repetition({}, mode))}><IntervalLogo className="btn-icon" /> Interval</Button>
      {props.sportType === "bike" &&
        <IconButton label="Free Ride" icon={faBicycle} onClick={() => addInterval(intervalFactory.free({}, mode))} />
      }
      <IconButton label="Text Event" icon={faComment} onClick={() => addInstruction(createInstruction({}, mode))} />
      {props.sportType === "bike" &&
        <NumberField name="ftp" label={"FTP (W)"} value={props.ftp} onChange={props.setFtp} />
      }
      {props.sportType === "bike" &&
        <NumberField name="weight" label={"Body Weight (kg)"} value={props.weight} onChange={props.setWeight} />
      }
      <IconButton label="New" icon={faFile} onClick={() => { if (window.confirm('Are you sure you want to create a new workout?')) props.clearWorkout() }} />
      <IconButton label="Download" icon={faDownload} onClick={downloadWorkout} />
      <UploadButton onUpload={handleUpload} />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  name: selectName(state),
  author: selectAuthor(state),
  description: selectDescription(state),
  tags: selectTags(state),
  sportType: selectSportType(state),
  lengthType: selectLengthType(state),
  ftp: selectFtp(state),
  weight: selectWeight(state),
  intervals: selectIntervals(state),
  instructions: selectInstructions(state),
  mode: selectMode(state),
});

const mapDispatchToProps = {
  setFtp,
  setWeight,
  addInterval,
  addInstruction,
  clearWorkout,
  loadWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

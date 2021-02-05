import React from 'react';
import { connect } from 'react-redux';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import createWorkoutXml from '../../xml/createWorkoutXml';
import { Interval } from '../../types/Interval';
import { Instruction } from '../../types/Instruction';
import IconButton from '../Button/IconButton';
import { SportType } from '../../types/SportType';
import { LengthType } from '../../types/LengthType';
import { selectAuthor, selectDescription, selectName, selectTags, selectSportType, selectLengthType } from '../../rdx/meta';
import { RootState } from '../../rdx/store';
import { selectIntervals } from '../../rdx/intervals';
import { selectInstructions } from '../../rdx/instructions';
import { WorkoutMode } from '../../modes/WorkoutMode';
import { selectMode } from '../../rdx/mode';

interface DownloadButtonProps {
  name: string;
  author: string;
  description: string;
  tags: string[];
  sportType: SportType;
  lengthType: LengthType;
  intervals: Interval[];
  instructions: Instruction[];
  mode: WorkoutMode,
}

const DownloadButton = (props: DownloadButtonProps) => {
  function createZwoFile() {
    const xml = createWorkoutXml({
      name: props.name,
      author: props.author,
      description: props.description,
      tags: props.tags,
      sportType: props.sportType,
      lengthType: props.lengthType,
      intervals: props.intervals,
      instructions: props.instructions,
    }, props.mode);

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

  return (
    <IconButton label="Download" icon={faDownload} onClick={downloadWorkout} />
  );
};

const mapStateToProps = (state: RootState) => ({
  name: selectName(state),
  author: selectAuthor(state),
  description: selectDescription(state),
  tags: selectTags(state),
  sportType: selectSportType(state),
  lengthType: selectLengthType(state),
  intervals: selectIntervals(state),
  instructions: selectInstructions(state),
  mode: selectMode(state),
});

export default connect(mapStateToProps)(DownloadButton);

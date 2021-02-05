import React from 'react';
import { connect } from 'react-redux';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import createWorkoutXml from '../../xml/createWorkoutXml';
import IconButton from '../Button/IconButton';
import { selectAuthor, selectDescription, selectName, selectTags, selectSportType, selectLengthType } from '../../rdx/meta';
import { RootState } from '../../rdx/store';
import { selectIntervals } from '../../rdx/intervals';
import { selectInstructions } from '../../rdx/instructions';
import { selectMode } from '../../rdx/mode';
import { ConnectedProps } from '../../types/ConnectedProps';

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

type DownloadButtonProps = ConnectedProps<typeof mapStateToProps>;

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

export default connect(mapStateToProps)(DownloadButton);

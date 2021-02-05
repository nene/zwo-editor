import React from 'react'
import { connect } from 'react-redux';
import { ZoneColor, Zones } from '../../types/Zones'
import { faFile, faComment, faBicycle } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as WarmdownLogo } from '../../assets/warmdown.svg'
import { ReactComponent as WarmupLogo } from '../../assets/warmup.svg'
import { ReactComponent as IntervalLogo } from '../../assets/interval.svg'
import { ReactComponent as SteadyLogo } from '../../assets/steady.svg'
import { createInstruction } from '../../types/Instruction'
import intervalFactory from '../../interval/intervalFactory'
import NumberField from '../Editor/NumberField'
import UploadButton from './UploadButton'
import IconButton from '../Button/IconButton'
import ColorButton from '../Button/ColorButton'
import Button from '../Button/Button'
import { selectSportType } from '../../rdx/meta'
import { RootState } from '../../rdx/store';
import { selectFtp, selectWeight, setFtp, setWeight } from '../../rdx/athlete';
import { addInterval } from '../../rdx/intervals';
import { addInstruction } from '../../rdx/instructions';
import { selectMode } from '../../rdx/mode';
import { clearWorkout, loadWorkout } from '../../rdx/workout';
import DownloadButton from './DownloadButton';
import styled from 'styled-components';
import { ConnectedProps } from '../../types/ConnectedProps';

const mapStateToProps = (state: RootState) => ({
  sportType: selectSportType(state),
  ftp: selectFtp(state),
  weight: selectWeight(state),
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

type ToolbarProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

const Toolbar = ({mode, addInterval, addInstruction, ...props}: ToolbarProps) => {
  return (
    <Container>
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
      <DownloadButton />
      <UploadButton mode={mode} onUpload={props.loadWorkout} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 10px auto;
  padding: 20px;
  background-color: white;

  -webkit-box-shadow: 0px 0px 27px -9px rgba(0,0,0,0.35);
  -moz-box-shadow: 0px 0px 27px -9px rgba(0,0,0,0.35);
  box-shadow: 0px 0px 27px -9px rgba(0,0,0,0.35);
  border-radius: 5px;

  & > .form-input {
    max-width: 100px;
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

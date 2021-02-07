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
import { selectSportType } from '../../rdx/state/meta'
import { RootState } from '../../rdx/store';
import { selectFtp, selectWeight, setFtp, setWeight } from '../../rdx/state/athlete';
import { addInterval } from '../../rdx/state/intervals';
import { addInstruction } from '../../rdx/state/instructions';
import { selectMode } from '../../rdx/state/mode';
import { clearWorkout, loadWorkout } from '../../rdx/state/workout';
import DownloadButton from './DownloadButton';
import styled from 'styled-components';
import { ConnectedProps } from '../../types/ConnectedProps';
import SvgButton from '../Button/SvgButton';

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
          <ColorButton color={ZoneColor.GRAY} onClick={() => addInterval(intervalFactory.steady({ intensity: 0.5 }, mode))}>Z1</ColorButton>
          <ColorButton color={ZoneColor.BLUE} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z2.min }, mode))}>Z2</ColorButton>
          <ColorButton color={ZoneColor.GREEN} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z3.min }, mode))}>Z3</ColorButton>
          <ColorButton color={ZoneColor.YELLOW} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z4.min }, mode))}>Z4</ColorButton>
          <ColorButton color={ZoneColor.ORANGE} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z5.min }, mode))}>Z5</ColorButton>
          <ColorButton color={ZoneColor.RED} onClick={() => addInterval(intervalFactory.steady({ intensity: Zones.Z6.min }, mode))}>Z6</ColorButton>
        </div>
        :
        <SvgButton svg={SteadyLogo} onClick={() => addInterval(intervalFactory.steady({}, mode))}>Steady Pace</SvgButton>
      }

      <SvgButton svg={WarmupLogo} onClick={() => addInterval(intervalFactory.ramp({ startIntensity: 0.25, endIntensity: 0.75 }, mode))}>Warm up</SvgButton>
      <SvgButton svg={WarmdownLogo} onClick={() => addInterval(intervalFactory.ramp({ startIntensity: 0.75, endIntensity: 0.25 }, mode))}>Cool down</SvgButton>
      <SvgButton svg={IntervalLogo} onClick={() => addInterval(intervalFactory.repetition({}, mode))}>Interval</SvgButton>
      {props.sportType === "bike" &&
        <IconButton icon={faBicycle} onClick={() => addInterval(intervalFactory.free({}, mode))}>Free Ride</IconButton>
      }
      <IconButton icon={faComment} onClick={() => addInstruction(createInstruction({}, mode))}>Text Event</IconButton>
      {props.sportType === "bike" &&
        <NumberField name="ftp" label={"FTP (W)"} value={props.ftp} onChange={props.setFtp} />
      }
      {props.sportType === "bike" &&
        <NumberField name="weight" label={"Body Weight (kg)"} value={props.weight} onChange={props.setWeight} />
      }
      <IconButton icon={faFile} onClick={() => { if (window.confirm('Are you sure you want to create a new workout?')) props.clearWorkout() }}>New</IconButton>
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
`;

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

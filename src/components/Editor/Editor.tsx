import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import GenericBar from '../Bar/GenericBar'
import InstructionEditor from '../InstructionEditor/InstructionEditor'
import TimeAxis from '../Axis/TimeAxis'
import ZoneAxis from '../Axis/ZoneAxis'
import { Interval } from '../../types/Interval'
import { Instruction } from '../../types/Instruction'
import { workoutDuration } from '../../utils/duration'
import DistanceAxis from '../Axis/DistanceAxis'
import { selectLengthType } from '../../rdx/state/meta'
import { RootState } from '../../rdx/store';
import { selectIntervals, updateInterval } from '../../rdx/state/intervals';
import { selectInstructions, updateInstruction, removeInstruction } from '../../rdx/state/instructions';
import { selectMode } from '../../rdx/state/mode';
import { ConnectedProps } from '../../types/ConnectedProps';
import { selectSelectedId, clearSelection, setSelectedId } from '../../rdx/state/selectedId';
import SelectionToolbar from '../SelectionToolbar/SelectionToolbar';
import styled from 'styled-components';

const mapStateToProps = (state: RootState) => ({
  lengthType: selectLengthType(state),
  intervals: selectIntervals(state),
  instructions: selectInstructions(state),
  mode: selectMode(state),
  selectedId: selectSelectedId(state),
});

const mapDispatchToProps = {
  updateInterval,
  updateInstruction,
  setSelectedId,
  clearSelection,
  removeInstruction,
};

type EditorProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

const Editor = ({
  lengthType,
  intervals,
  instructions,
  mode,
  selectedId,
  updateInterval,
  updateInstruction,
  setSelectedId,
  clearSelection,
  removeInstruction,
}: EditorProps) => {
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

  return (
    <Container>
      {selectedId && <SelectionToolbar />}

      <Canvas ref={canvasRef}>
        {selectedId &&
          <Fader style={{width: canvasRef.current?.scrollWidth}} onClick={clearSelection} />
        }
        <Segments ref={segmentsRef}>
          {intervals.map(renderInterval)}
        </Segments>

        <Slider>
          {instructions.map((instruction, index) => renderInstruction(instruction, index))}
        </Slider>

        {lengthType === "time" ? <TimeAxis width={xAxisWidth} /> : <DistanceAxis width={xAxisWidth} />}
      </Canvas>
      <ZoneAxis />
    </Container>
  )
}

const Container = styled.div`
  flex: 1;
  position: relative;  
  white-space: nowrap;
  background-color: white;

  padding: 0px 40px;  
  margin: 10px auto;
  overflow-x: hidden;
  width: 100%;
  max-width: 1280px;
  -webkit-box-shadow: 0px 0px 27px -9px rgba(0,0,0,0.35);
  -moz-box-shadow: 0px 0px 27px -9px rgba(0,0,0,0.35);
  box-shadow: 0px 0px 27px -9px rgba(0,0,0,0.35);
  border-radius: 5px;
`;

const Canvas = styled.div`
  position: absolute;
  width: 100%;
  max-width: 1320px;
  height: 100%;
  overflow-y: hidden;
  overflow-x: visible;
  bottom: 10px;
`;

const Segments = styled.div`
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-end;  
  bottom: 0px;
  padding-bottom: 40px;
  margin-right: 100px;
`;

const Fader = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.9);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 50000px;
  height: 100%;
  z-index: 1;
`;

const Slider = styled.div`
  position: absolute;  
  top: 10px;
  left: 0px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Editor)

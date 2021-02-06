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
    <div id="editor" className='editor'>
      {selectedId && <SelectionToolbar />}
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
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)

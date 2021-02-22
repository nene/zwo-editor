import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import GenericBar from "../Bar/GenericBar";
import TimeAxis from "../Axis/TimeAxis";
import ZoneAxis from "../Axis/ZoneAxis";
import DistanceAxis from "../Axis/DistanceAxis";
import { selectLengthType } from "../../rdx/state/meta";
import { RootState } from "../../rdx/store";
import {
  removeInstruction,
  selectIntervals,
  updateInstruction,
  updateInterval,
} from "../../rdx/state/intervals";
import { selectMode } from "../../rdx/state/mode";
import { ConnectedProps } from "../../types/ConnectedProps";
import {
  selectSelectedId,
  clearSelection,
  setSelectedId,
} from "../../rdx/state/selectedId";
import SelectionToolbar from "../SelectionToolbar/SelectionToolbar";
import styled from "styled-components";

const mapStateToProps = (state: RootState) => ({
  lengthType: selectLengthType(state),
  intervals: selectIntervals(state),
  mode: selectMode(state),
  selectedId: selectSelectedId(state),
});

const mapDispatchToProps = {
  updateInterval,
  setSelectedId,
  clearSelection,
  updateInstruction,
  removeInstruction,
};

type EditorProps = ConnectedProps<
  typeof mapStateToProps,
  typeof mapDispatchToProps
>;

const Editor = ({
  lengthType,
  intervals,
  mode,
  selectedId,
  updateInterval,
  setSelectedId,
  clearSelection,
  updateInstruction,
  removeInstruction,
}: EditorProps) => {
  const segmentsRef = useRef<HTMLDivElement>(null);
  const [xAxisWidth, setXAxisWidth] = useState(1320);

  useEffect(() => {
    setXAxisWidth(segmentsRef.current?.scrollWidth || 1320);
  }, [segmentsRef]);

  function toggleSelection(id: string) {
    if (id === selectedId) {
      clearSelection();
    } else {
      setSelectedId(id);
    }
  }

  return (
    <Container>
      {selectedId && <SelectionToolbar />}

      <Canvas>
        {selectedId && (
          <Fader style={{ width: xAxisWidth }} onClick={clearSelection} />
        )}
        <Segments ref={segmentsRef}>
          {intervals.map((interval) => (
            <GenericBar
              key={interval.id}
              interval={interval}
              mode={mode}
              onChange={updateInterval}
              onClick={toggleSelection}
              onInstructionChange={updateInstruction}
              onInstructionDelete={removeInstruction}
              selected={interval.id === selectedId}
            />
          ))}
        </Segments>

        {lengthType === "time" ? (
          <TimeAxis width={xAxisWidth} />
        ) : (
          <DistanceAxis width={xAxisWidth} />
        )}
      </Canvas>
      <ZoneAxis />
    </Container>
  );
};

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
  -webkit-box-shadow: 0px 0px 27px -9px rgba(0, 0, 0, 0.35);
  -moz-box-shadow: 0px 0px 27px -9px rgba(0, 0, 0, 0.35);
  box-shadow: 0px 0px 27px -9px rgba(0, 0, 0, 0.35);
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
  top: 0px;
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

export default connect(mapStateToProps, mapDispatchToProps)(Editor);

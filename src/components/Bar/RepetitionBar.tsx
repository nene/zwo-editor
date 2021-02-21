import React, { useMemo, useState } from "react";
import SteadyBar from "./SteadyBar";
import styled from "styled-components";
import { RepetitionInterval, SteadyInterval } from "../../types/Interval";
import { WorkoutMode } from "../../modes/WorkoutMode";
import { repetitions } from "../../interval/repetition";

interface RepetitionBarProps {
  interval: RepetitionInterval;
  mode: WorkoutMode;
  onChange: (interval: RepetitionInterval) => void;
  onClick: (id: string) => void;
  selected: boolean;
}

const RepetitionBar = ({ interval, ...props }: RepetitionBarProps) => {
  const [repeat, setRepeat] = useState(interval.repeat);

  const subIntervals = useMemo(() => {
    return repetitions(repeat, interval, props.mode);
    // eslint-disable-next-line
  }, [repeat]);

  function handleOnChange(values: SteadyInterval) {
    const index = subIntervals.findIndex((sub) => sub.id === values.id);

    for (var i = 0; i < subIntervals.length; i++) {
      if (index % 2 === i % 2) {
        subIntervals[i].length = values.length;
        subIntervals[i].intensity = values.intensity;
        subIntervals[i].cadence = values.cadence;
      }
    }

    props.onChange({
      ...interval,
      onCadence: subIntervals[0].cadence,
      offCadence: subIntervals[1].cadence,
      repeat: repeat,
      onLength: subIntervals[0].length,
      offLength: subIntervals[1].length,
      onIntensity: subIntervals[0].intensity,
      offIntensity: subIntervals[1].intensity,
    });
  }

  function handleAddInterval() {
    setRepeat(repeat + 1);
    props.onChange({
      ...interval,
      repeat: interval.repeat + 1,
    });
  }

  function handleRemoveInterval() {
    if (repeat > 1) {
      setRepeat(repeat - 1);
      props.onChange({
        ...interval,
        repeat: interval.repeat - 1,
      });
    }
  }

  const renderBar = (subInterval: SteadyInterval, withTooltip: boolean) => (
    <SteadyBar
      key={subInterval.id}
      interval={subInterval}
      mode={props.mode}
      onChange={handleOnChange}
      onClick={() => props.onClick(interval.id)}
      selected={props.selected}
      showTooltip={withTooltip}
    />
  );

  return (
    <div>
      <Buttons>
        <button onClick={handleAddInterval}>+</button>
        <button onClick={handleRemoveInterval}>-</button>
      </Buttons>
      <SubIntervals>
        {subIntervals.map((sub, index) =>
          renderBar(sub, index === 0 || index === subIntervals.length - 1)
        )}
      </SubIntervals>
    </div>
  );
};

const Buttons = styled.div`
  position: absolute;
  margin-top: -30px;
`;

const SubIntervals = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

export default RepetitionBar;

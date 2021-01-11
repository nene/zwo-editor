import React, { useMemo, useState } from 'react'
import SteadyBar from './SteadyBar'
import './RepetitionBar.css'
import { RepetitionInterval, SteadyInterval } from '../../types/Interval'
import { WorkoutMode } from '../../modes/WorkoutMode'
import intervalFactory from '../../interval/intervalFactory'

interface RepetitionBarProps {
  interval: RepetitionInterval;
  mode: WorkoutMode;
  onChange: (interval: RepetitionInterval) => void;
  onClick: (id: string) => void;
  selected: boolean;
}

const RepetitionBar = ({interval, ...props}: RepetitionBarProps) => {
  const [repeat, setRepeat] = useState(interval.repeat)

  const [onDuration, setOnDuration] = useState(interval.onLength)
  const [offDuration, setOffDuration] = useState(interval.offLength)

  const subIntervals = useMemo(() => {
    const subIntervals: SteadyInterval[] = []

    for (var i = 0; i < repeat; i++) {
      subIntervals.push(intervalFactory.steady({
        length: onDuration,
        intensity: interval.onIntensity,
        cadence: interval.cadence,
        pace: interval.pace,
      }, props.mode));

      subIntervals.push(intervalFactory.steady({
        length: offDuration,
        intensity: interval.offIntensity,
        cadence: interval.restingCadence,
        pace: interval.pace,
      }, props.mode));
    }
    return subIntervals;
    // eslint-disable-next-line
  }, [repeat]);

  function handleOnChange(values: SteadyInterval) {
    const index = subIntervals.findIndex(sub => sub.id === values.id)
    
    if (index % 2 === 1) {
      setOffDuration(values.length)
    }else{
      setOnDuration(values.length)
    }

    for (var i = 0; i < subIntervals.length; i++) {
      if (index % 2 === i % 2) {       
        subIntervals[i].length = values.length
        subIntervals[i].intensity = values.intensity
        subIntervals[i].cadence = values.cadence        
      }      
    }

    props.onChange({
      ...interval,
      cadence: subIntervals[0].cadence,
      restingCadence: subIntervals[1].cadence,
      repeat: repeat,
      onLength: subIntervals[0].length,
      offLength: subIntervals[1].length,
      onIntensity: subIntervals[0].intensity,
      offIntensity: subIntervals[1].intensity,
    })

  }

  function handleAddInterval() {
    setRepeat(repeat + 1)
    props.onChange({
      ...interval,
      repeat: interval.repeat + 1,
    })
  }

  function handleRemoveInterval() {
    if (repeat > 1) {
      setRepeat(repeat - 1)
      props.onChange({
        ...interval,
        repeat: interval.repeat - 1,
      })
    }
  }

  const renderBar = (subInterval: SteadyInterval, withLabel: boolean) => (
    <SteadyBar
      key={subInterval.id}
      interval={subInterval}
      mode={props.mode}
      onChange={handleOnChange}
      onClick={() => props.onClick(interval.id)}
      selected={props.selected}
      showLabel={withLabel}
    />
  )


  return (
    <div>
      <div className='buttons'><button onClick={handleAddInterval}>+</button><button onClick={handleRemoveInterval}>-</button></div>
      <div className='intervals'>
        {subIntervals.map((sub, index) => renderBar(sub, index === 0 || index === subIntervals.length - 1))}
      </div>      
    </div>
  )
}

export default RepetitionBar

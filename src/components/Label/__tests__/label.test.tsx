import React from 'react';
import Label from '../Label';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect'
import { PaceType } from '../../../types/PaceType';
import intervalFactory from '../../../interval/intervalFactory';
import createMode from '../../../modes/createMode';
import { Duration } from '../../../types/Length';

const MockReact = React;

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon(props: any) {
    return MockReact.createElement("FontAwesomeIcon", props);
  },
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faBolt: "faBolt",
  faClock: "faClock",
}));

describe('<Label>', () => {
  test('for cycling, renders: duration, power, w/kg, %FTP, cadence', () => {
    const mode = createMode({sportType: "bike", ftp: 200, weight: 75, runningTimes: [], lengthType: "time"});
    const interval = intervalFactory.steady({ length: new Duration(100), intensity: 1.25, cadence: 0 }, mode);
    const component = renderer.create(
      <Label interval={interval} mode={mode} onCadenceChange={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  test('for cycling ramp, renders: duration, power-range, %FTP-range, cadence', () => {
    const mode = createMode({sportType: "bike", ftp: 200, weight: 75, runningTimes: [], lengthType: "time"});
    const interval = intervalFactory.ramp({ length: new Duration(100), startIntensity: 0.5, endIntensity: 1.0, cadence: 0 }, mode);
    const component = renderer.create(
      <Label interval={interval} mode={mode} onCadenceChange={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  test('for running, renders: duration, distance, %pace, pace type', () => {
    const mode = createMode({sportType: "run", ftp: 1234, weight: 75, runningTimes: [0, 0, 1000, 0, 0], lengthType: "time"});
    const interval = intervalFactory.steady({ length: new Duration(100), intensity: 1.25, cadence: 0, pace: PaceType.tenKm }, mode);
    const component = renderer.create(
      <Label interval={interval} mode={mode} onCadenceChange={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  test('for running ramp, renders: duration, distance, %pace-range, pace type', () => {
    const mode = createMode({sportType: "run", ftp: 1234, weight: 75, runningTimes: [0, 0, 1000, 0, 0], lengthType: "time"});
    const interval = intervalFactory.ramp({ length: new Duration(100), startIntensity: 0.5, endIntensity: 1.0, cadence: 0, pace: PaceType.tenKm }, mode);
    const component = renderer.create(
      <Label interval={interval} mode={mode} onCadenceChange={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });
});

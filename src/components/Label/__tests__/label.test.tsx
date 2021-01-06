import React from 'react';
import Label from '../Label';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect'
import { PaceType } from '../../../types/PaceType';
import intervalFactory from '../../../interval/intervalFactory';
import createMode from '../../../modes/createMode';

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
    const interval = intervalFactory.steady({ length: 100, intensity: 1.25, cadence: 0 });
    const mode = createMode("bike", 200, 75, [], "time");
    const component = renderer.create(
      <Label interval={interval} mode={mode} onCadenceChange={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  test('for cycling ramp, renders: duration, power-range, %FTP-range, cadence', () => {
    const interval = intervalFactory.ramp({ length: 100, startIntensity: 0.5, endIntensity: 1.0, cadence: 0 });
    const mode = createMode("bike", 200, 75, [], "time");
    const component = renderer.create(
      <Label interval={interval} mode={mode} onCadenceChange={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  test('for running, renders: duration, distance, %pace, pace type', () => {
    const interval = intervalFactory.steady({ length: 100, intensity: 1.25, cadence: 0, pace: PaceType.tenKm });
    const mode = createMode("run", 1234, 75, [0, 0, 1000, 0, 0], "time");
    const component = renderer.create(
      <Label interval={interval} mode={mode} onCadenceChange={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  test('for running ramp, renders: duration, distance, %pace-range, pace type', () => {
    const interval = intervalFactory.ramp({ length: 100, startIntensity: 0.5, endIntensity: 1.0, cadence: 0, pace: PaceType.tenKm });
    const mode = createMode("run", 1234, 75, [0, 0, 1000, 0, 0], "time");
    const component = renderer.create(
      <Label interval={interval} mode={mode} onCadenceChange={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });
});

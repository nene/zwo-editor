import React from 'react';
import SteadyBar from '../SteadyBar';
import { Zones } from '../../Zones'
import renderer from 'react-test-renderer';
import { v4 as uuidv4 } from 'uuid'
import '@testing-library/jest-dom/extend-expect'

test('SteadyBar renders correctly', () => {
  const interval = {
    time: 50,
    length: 0,
    power: Zones.Z3.min,
    type: 'steady',
    id: uuidv4()
  }

  const ftp = 250

  const component = renderer.create(
    <SteadyBar
      interval={interval}
      ftp={ftp}
      onChange={() => { }}
      onClick={() => { }}
    />
  )

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})
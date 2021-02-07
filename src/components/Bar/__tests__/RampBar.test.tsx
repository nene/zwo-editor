import React from "react";
import RampBar from "../RampBar";
import { Zones } from "../../../types/Zones";
import renderer from "react-test-renderer";
import intervalFactory from "../../../interval/intervalFactory";
import createMode from "../../../modes/createMode";
import { Duration } from "../../../types/Length";

const MockReact = React;

jest.mock("../../Tooltip/Tooltip", () => (props: any) =>
  MockReact.createElement("Tooltip", props)
);

jest.mock("re-resizable", () => ({
  Resizable: (props: any) => MockReact.createElement("Resizable", props),
}));

jest.mock("uuid", () => ({
  v4: () => `mock-id`,
}));

describe("<SteadyBar>", () => {
  it("renders", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 250,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const interval = intervalFactory.ramp(
      {
        length: new Duration(50),
        startIntensity: Zones.Z2.min,
        endIntensity: Zones.Z4.min,
      },
      mode
    );

    const component = renderer.create(
      <RampBar
        interval={interval}
        mode={mode}
        selected={false}
        onChange={() => {}}
        onClick={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it("renders with Tooltip when selected", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 250,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const interval = intervalFactory.ramp(
      {
        length: new Duration(50),
        startIntensity: Zones.Z2.min,
        endIntensity: Zones.Z4.min,
      },
      mode
    );

    const component = renderer.create(
      <RampBar
        interval={interval}
        mode={mode}
        selected={true}
        onChange={() => {}}
        onClick={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
  });
});

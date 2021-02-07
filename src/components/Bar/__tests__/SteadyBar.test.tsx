import React from "react";
import SteadyBar from "../SteadyBar";
import { Zones } from "../../../types/Zones";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom/extend-expect";
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
    const interval = intervalFactory.steady(
      {
        length: new Duration(50),
        intensity: Zones.Z3.min,
      },
      mode
    );

    const component = renderer.create(
      <SteadyBar
        interval={interval}
        mode={mode}
        selected={false}
        showTooltip={false}
        onChange={() => {}}
        onClick={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it("renders without Tooltip when selected, but showTooltip=false", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 250,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const interval = intervalFactory.steady(
      {
        length: new Duration(50),
        intensity: Zones.Z3.min,
      },
      mode
    );

    const component = renderer.create(
      <SteadyBar
        interval={interval}
        mode={mode}
        selected={true}
        showTooltip={false}
        onChange={() => {}}
        onClick={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it("renders with Tooltip when selected and showTooltip=true", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 250,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const interval = intervalFactory.steady(
      {
        length: new Duration(50),
        intensity: Zones.Z3.min,
      },
      mode
    );

    const component = renderer.create(
      <SteadyBar
        interval={interval}
        mode={mode}
        selected={true}
        showTooltip={true}
        onChange={() => {}}
        onClick={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
  });
});

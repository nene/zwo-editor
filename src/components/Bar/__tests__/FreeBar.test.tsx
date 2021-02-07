import React from "react";
import FreeBar from "../FreeBar";
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

describe("<FreeBar>", () => {
  it("renders", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const interval = intervalFactory.free(
      {
        length: new Duration(50),
      },
      mode
    );

    const component = renderer.create(
      <FreeBar
        interval={interval}
        mode={mode}
        selected={false}
        onChange={() => {}}
        onClick={() => {}}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it("renders with tooltip when selected", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const interval = intervalFactory.free(
      {
        length: new Duration(50),
      },
      mode
    );

    const component = renderer.create(
      <FreeBar
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

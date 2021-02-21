import { repetitionToSteadyIntervals } from "../repetition";
import { Duration } from "../../types/Length";
import intervalFactory from "../intervalFactory";
import BikeMode from "../../modes/BikeMode";

jest.mock("uuid", () => ({
  v4: () => `mock-id`,
}));

const defaultBikeMode = () => new BikeMode(200, 75);

describe("repetitionToSteadyIntervals()", () => {
  it("converts RepetitionInterval to an array of SteadyIntervals", () => {
    const mode = defaultBikeMode();
    expect(
      repetitionToSteadyIntervals(
        intervalFactory.repetition(
          {
            id: "#1",
            repeat: 2,
            onLength: Duration(60),
            offLength: Duration(30),
            onIntensity: 0.9,
            offIntensity: 0.75,
            onCadence: 90,
            offCadence: undefined,
          },
          mode
        ),
        mode
      )
    ).toMatchSnapshot();
  });
});

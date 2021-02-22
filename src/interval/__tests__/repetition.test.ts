import { repetitionToSteadyIntervals } from "../repetition";
import { Duration } from "../../types/Length";
import intervalFactory from "../intervalFactory";
import BikeMode from "../../modes/BikeMode";
import { createInstruction } from "../../types/Instruction";

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

  it("distributes instructions between SteadyIntervals", () => {
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
            instructions: [
              createInstruction(
                {
                  offset: Duration(10),
                  text: "In first interval",
                },
                mode
              ),
              createInstruction(
                {
                  offset: Duration(60),
                  text: "In second interval #1",
                },
                mode
              ),
              createInstruction(
                {
                  offset: Duration(80),
                  text: "In second interval #2",
                },
                mode
              ),
              createInstruction(
                {
                  offset: Duration(100),
                  text: "In third interval",
                },
                mode
              ),
              createInstruction(
                {
                  offset: Duration(150),
                  text: "In fourth interval",
                },
                mode
              ),
            ],
          },
          mode
        ),
        mode
      )
    ).toMatchSnapshot();
  });
});

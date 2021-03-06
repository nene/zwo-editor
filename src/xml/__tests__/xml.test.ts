import intervalFactory from "../../interval/intervalFactory";
import createMode from "../../modes/createMode";
import { createInstruction } from "../../types/Instruction";
import { Distance, Duration } from "../../types/Length";
import { PaceType } from "../../types/PaceType";
import { Workout } from "../../types/Workout";
import createWorkoutXml from "../createWorkoutXml";
import parseWorkoutXml from "../parseWorkoutXml";

jest.mock("uuid", () => ({
  v4: () => "mock-id",
}));

describe("XML", () => {
  it("creates and parses an empty workout", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const workout: Workout = {
      name: "Sample Workout",
      author: "John Doe",
      description: "Some intervals for your pleasure (or pain).",
      tags: ["RECOVERY", "INTERVALS"],
      sportType: mode.sportType,
      lengthType: mode.lengthType,
      intervals: [],
    };
    const xml = createWorkoutXml(workout, mode);
    expect(xml).toMatchSnapshot();

    // Parsing of tags not yet supported
    expect(parseWorkoutXml(xml, mode)).toEqual(workout);
  });

  it("creates and parses bike workout (without cadence)", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const workout: Workout = {
      name: "Cycling Workout",
      author: "Eddy Merckx",
      description: "Featuring a mixture of different interval types.",
      tags: [],
      sportType: mode.sportType,
      lengthType: mode.lengthType,
      intervals: [
        // Warmup: 10:00 30%..75%
        intervalFactory.ramp(
          {
            length: Duration(10 * 60),
            startIntensity: 0.3,
            endIntensity: 0.75,
            instructions: [
              // @ 00:00 - at the start of warmup
              createInstruction(
                { offset: Duration(0), text: "Welcome to the workout!" },
                mode
              ),
            ],
          },
          mode
        ),
        // Steady: 5:00 80%
        intervalFactory.steady(
          {
            length: Duration(5 * 60),
            intensity: 0.8,
            instructions: [
              // @ 12:30 - at the middle of second block
              createInstruction(
                {
                  offset: Duration(2 * 60 + 30),
                  text: "This is just a warmup still",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Intervals: 4 x ON 0:30 120%, OFF 1:00 60%
        intervalFactory.repetition(
          {
            repeat: 4,
            onLength: Duration(30),
            onIntensity: 1.2,
            offLength: Duration(60),
            offIntensity: 0.6,
            instructions: [
              // @ 15:00 - at the start of repetition block
              createInstruction(
                {
                  offset: Duration(0),
                  text: "It's the first one of four sprint efforts",
                },
                mode
              ),
              // @ 19:30 - at the start of last repetition block
              createInstruction(
                {
                  offset: Duration(4 * 60 + 30),
                  text: "It's the first one of four sprint efforts",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Ramp 1:00 80%..150%
        intervalFactory.ramp(
          {
            length: Duration(60),
            startIntensity: 0.8,
            endIntensity: 1.5,
            instructions: [
              // @ 21:00 - at the start of a ramp
              createInstruction(
                {
                  offset: Duration(0),
                  text: "As a bonus, we'll ramp up really hard :)",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Freeride: 20:00
        intervalFactory.free(
          {
            length: Duration(20 * 60),
            instructions: [
              // @ 32:00 - inside freeride
              createInstruction(
                {
                  offset: Duration(10 * 60),
                  text: "Ride as hard as you can for 20 minutes!",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Cooldown: 10:00 30%..30%
        intervalFactory.ramp(
          {
            length: Duration(10 * 60),
            startIntensity: 0.7,
            endIntensity: 0.3,
            instructions: [
              // @ 51:50 - almost at the very end of cooldown
              createInstruction(
                {
                  offset: Duration(9 * 60 + 50),
                  text: "This was it. See you next time.",
                },
                mode
              ),
            ],
          },
          mode
        ),
      ],
    };
    const xml = createWorkoutXml(workout, mode);
    expect(xml).toMatchSnapshot();

    expect(parseWorkoutXml(xml, mode)).toEqual(workout);
  });

  it("creates and parses bike workout (with cadence)", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const workout: Workout = {
      name: "Cycling Workout",
      author: "Eddy Merckx",
      description: "Featuring a mixture of different interval types.",
      tags: [],
      sportType: mode.sportType,
      lengthType: mode.lengthType,
      intervals: [
        // Warmup: 10:00 30%..75% 80rpm
        intervalFactory.ramp(
          {
            length: Duration(10 * 60),
            startIntensity: 0.3,
            endIntensity: 0.75,
            cadence: 80,
          },
          mode
        ),
        // Steady: 5:00 80% 90rpm
        intervalFactory.steady(
          { length: Duration(5 * 60), intensity: 0.8, cadence: 90 },
          mode
        ),
        // Intervals: 4 x ON 0:30 120% 100rpm, OFF 1:00 60% 60rpm
        intervalFactory.repetition(
          {
            repeat: 4,
            onLength: Duration(30),
            onIntensity: 1.2,
            onCadence: 100,
            offLength: Duration(60),
            offIntensity: 0.6,
            offCadence: 60,
          },
          mode
        ),
        // Ramp 1:00 80%..150% 90rpm
        intervalFactory.ramp(
          {
            length: Duration(60),
            startIntensity: 0.8,
            endIntensity: 1.5,
            cadence: 90,
          },
          mode
        ),
        // Freeride: 20:00
        intervalFactory.free({ length: Duration(20 * 60) }, mode),
        // Cooldown: 10:00 30%..30% 85rpm
        intervalFactory.ramp(
          {
            length: Duration(10 * 60),
            startIntensity: 0.7,
            endIntensity: 0.3,
            cadence: 85,
          },
          mode
        ),
      ],
    };
    const xml = createWorkoutXml(workout, mode);
    expect(xml).toMatchSnapshot();

    expect(parseWorkoutXml(xml, mode)).toEqual(workout);
  });

  it("creates and parses run workout (duration-based)", () => {
    const mode = createMode({
      sportType: "run",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const workout: Workout = {
      name: "Run Workout",
      author: "Carl Lewis",
      description: "Featuring a mixture of different interval types.",
      tags: [],
      sportType: mode.sportType,
      lengthType: mode.lengthType,
      intervals: [
        // Warmup: 10:00 30%..75% of marathon pace
        intervalFactory.ramp(
          {
            length: Duration(10 * 60),
            startIntensity: 0.3,
            endIntensity: 0.75,
            pace: PaceType.marathon,
            instructions: [
              // @ 00:00 - at the start of warmup
              createInstruction(
                { offset: Duration(0), text: "Welcome to the workout!" },
                mode
              ),
            ],
          },
          mode
        ),
        // Steady: 5:00 80% of half-marathon pace
        intervalFactory.steady(
          {
            length: Duration(5 * 60),
            intensity: 0.8,
            pace: PaceType.halfMarathon,
            instructions: [
              // @ 12:30 - at the middle of second block
              createInstruction(
                {
                  offset: Duration(2 * 60 + 30),
                  text: "This is just a warmup still",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Intervals: 4 x ON 0:30 120%, OFF 1:00 60% of 5 km pace
        intervalFactory.repetition(
          {
            repeat: 4,
            onLength: Duration(30),
            onIntensity: 1.2,
            offLength: Duration(60),
            offIntensity: 0.6,
            pace: PaceType.fiveKm,
            instructions: [
              // @ 15:00 - at the start of repetition block
              createInstruction(
                {
                  offset: Duration(0),
                  text: "It's the first one of four sprint efforts",
                },
                mode
              ),
              // @ 19:30 - at the start of last repetition block
              createInstruction(
                {
                  offset: Duration(4 * 60 + 30),
                  text: "It's the first one of four sprint efforts",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Ramp 1:00 80%..150% of 1 mile pace
        intervalFactory.ramp(
          {
            length: Duration(60),
            startIntensity: 0.8,
            endIntensity: 1.5,
            pace: PaceType.oneMile,
            instructions: [
              // @ 21:00 - at the start of a ramp
              createInstruction(
                {
                  offset: Duration(0),
                  text: "As a bonus, we'll ramp up really hard :)",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Free run: 20:00
        intervalFactory.free(
          {
            length: Duration(20 * 60),
            instructions: [
              // @ 32:00 - inside freeride
              createInstruction(
                {
                  offset: Duration(10 * 60),
                  text: "Ride as hard as you can for 20 minutes!",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Cooldown: 10:00 30%..30% of 10 km pace
        intervalFactory.ramp(
          {
            length: Duration(10 * 60),
            startIntensity: 0.7,
            endIntensity: 0.3,
            pace: PaceType.tenKm,
            instructions: [
              // @ 51:50 - almost at the very end of cooldown
              createInstruction(
                {
                  offset: Duration(9 * 60 + 50),
                  text: "This was it. See you next time.",
                },
                mode
              ),
            ],
          },
          mode
        ),
      ],
    };
    const xml = createWorkoutXml(workout, mode);
    expect(xml).toMatchSnapshot();

    expect(parseWorkoutXml(xml, mode)).toEqual(workout);
  });

  it("creates and parses run workout (distance-based)", () => {
    const mode = createMode({
      sportType: "run",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "distance",
    });
    const workout: Workout = {
      name: "Run Workout",
      author: "Carl Lewis",
      description: "Featuring a mixture of different interval types.",
      tags: [],
      sportType: mode.sportType,
      lengthType: mode.lengthType,
      intervals: [
        // Warmup: 1000m 30%..75% of marathon pace
        intervalFactory.ramp(
          {
            length: Distance(1000),
            startIntensity: 0.3,
            endIntensity: 0.75,
            pace: PaceType.marathon,
            instructions: [
              // @ 0m - at the start of warmup
              createInstruction(
                { offset: Distance(0), text: "Welcome to the workout!" },
                mode
              ),
            ],
          },
          mode
        ),
        // Steady: 600m 80% of half-marathon pace
        intervalFactory.steady(
          {
            length: Distance(600),
            intensity: 0.8,
            pace: PaceType.halfMarathon,
            instructions: [
              // @ 1300m - at the middle of second block
              createInstruction(
                { offset: Distance(300), text: "This is just a warmup still" },
                mode
              ),
            ],
          },
          mode
        ),
        // Intervals: 4 x ON 200m 120%, OFF 400m 60% of 5 km pace
        intervalFactory.repetition(
          {
            repeat: 4,
            onLength: Distance(200),
            onIntensity: 1.2,
            offLength: Distance(400),
            offIntensity: 0.6,
            pace: PaceType.fiveKm,
            instructions: [
              // @ 1600m - at the start of repetition block
              createInstruction(
                {
                  offset: Distance(0),
                  text: "It's the first one of four sprint efforts",
                },
                mode
              ),
              // @ 3400m - at the start of last repetition block
              createInstruction(
                {
                  offset: Distance(1800),
                  text: "It's the first one of four sprint efforts",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Ramp 600m 80%..150% of 1 mile pace
        intervalFactory.ramp(
          {
            length: Distance(600),
            startIntensity: 0.8,
            endIntensity: 1.5,
            pace: PaceType.oneMile,
            instructions: [
              // @ 4000m - at the start of a ramp
              createInstruction(
                {
                  offset: Distance(0),
                  text: "As a bonus, we'll ramp up really hard :)",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Free run: 1000m
        intervalFactory.free(
          {
            length: Distance(1000),
            instructions: [
              // @ 4800m - inside freeride
              createInstruction(
                {
                  offset: Distance(200),
                  text: "Ride as hard as you can for 20 minutes!",
                },
                mode
              ),
            ],
          },
          mode
        ),
        // Cooldown: 1000m 70%..30% of 10 km pace
        intervalFactory.ramp(
          {
            length: Distance(1000),
            startIntensity: 0.7,
            endIntensity: 0.3,
            pace: PaceType.tenKm,
            instructions: [
              // @ 6400m - almost at the very end of cooldown
              createInstruction(
                {
                  offset: Distance(800),
                  text: "This was it. See you next time.",
                },
                mode
              ),
            ],
          },
          mode
        ),
      ],
    };
    const xml = createWorkoutXml(workout, mode);
    expect(xml).toMatchSnapshot();

    expect(parseWorkoutXml(xml, mode)).toEqual(workout);
  });

  it("excludes instructions past the end of workout", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const workout: Workout = {
      name: "Borderline instruction",
      author: "Who Knows",
      description: "Checking instruction positions.",
      tags: [],
      sportType: mode.sportType,
      lengthType: mode.lengthType,
      intervals: [
        // Steady: 5:00 80%
        intervalFactory.steady(
          {
            length: Duration(5 * 60),
            intensity: 0.8,
            instructions: [
              // @ 00:00 - at the start of workout
              createInstruction(
                { offset: Duration(0), text: "Are we there yet?" },
                mode
              ),
              // @ 04:59 - a second before the end of workout
              createInstruction(
                { offset: Duration(4 * 60 + 59), text: "Almost there!" },
                mode
              ),
              // @ 05:00 - right at the end
              createInstruction(
                { offset: Duration(5 * 60), text: "There!" },
                mode
              ),
              // @ 08:00 - well past the end
              createInstruction(
                { offset: Duration(8 * 60), text: "Enough of it!" },
                mode
              ),
            ],
          },
          mode
        ),
      ],
    };
    const xml = createWorkoutXml(workout, mode);
    expect(xml).toMatchSnapshot();

    expect(parseWorkoutXml(xml, mode)).toEqual({
      ...workout,
      intervals: [
        intervalFactory.steady(
          {
            length: Duration(5 * 60),
            intensity: 0.8,
            instructions: [
              // @ 00:00 - at the start of workout
              createInstruction(
                { offset: Duration(0), text: "Are we there yet?" },
                mode
              ),
              // @ 04:59 - a second before the end of workout
              createInstruction(
                { offset: Duration(4 * 60 + 59), text: "Almost there!" },
                mode
              ),
            ],
          },
          mode
        ),
      ],
    });
  });

  it("ignores comments", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });

    const xml = `
    <workout_file>
      <!-- start the workout -->
      <author>Johnny</author>
      <name>XML with comments</name>
      <description>Featuring a <!-- comment --> inside text.</description>
      <sportType>bike</sportType>
      <durationType>time</durationType>
      <tags>
        <tag name="RECOVERY"/>
        <tag name="INTERVALS"/>
      </tags>
      <workout>
        <SteadyState Duration="300" Power="0.8" pace="0"/>
        <!-- comment between intervals -->
        <SteadyState Duration="300" Power="0.8" pace="0">
          <textevent timeoffset="0" message="Welcome to the interval"/>
          <!-- comment between instructions -->
          <textevent timeoffset="290" message="Near the end now"/>
        </SteadyState>
      </workout>
    </workout_file>`;

    const workout: Workout = {
      name: "XML with comments",
      author: "Johnny",
      description: "Featuring a  inside text.",
      tags: ["RECOVERY", "INTERVALS"],
      sportType: mode.sportType,
      lengthType: mode.lengthType,
      intervals: [
        intervalFactory.steady(
          { length: Duration(5 * 60), intensity: 0.8 },
          mode
        ),
        intervalFactory.steady(
          {
            length: Duration(5 * 60),
            intensity: 0.8,
            instructions: [
              createInstruction(
                { offset: Duration(0), text: "Welcome to the interval" },
                mode
              ),
              createInstruction(
                { offset: Duration(4 * 60 + 50), text: "Near the end now" },
                mode
              ),
            ],
          },
          mode
        ),
      ],
    };

    expect(parseWorkoutXml(xml, mode)).toEqual(workout);
  });

  it("throws error when root element is not <workout_file>", () => {
    const mode = createMode({
      sportType: "bike",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });

    expect(() => parseWorkoutXml("<blah></blah>", mode)).toThrow(
      "Invalid ZWO file"
    );
  });
});

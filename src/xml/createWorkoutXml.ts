import Builder from "xmlbuilder";
import RunMode from "../modes/RunMode";
import { WorkoutMode } from "../modes/WorkoutMode";
import { Instruction } from "../types/Instruction";
import { Interval } from "../types/Interval";
import { Workout } from "../types/Workout";

export default function createWorkoutXml(
  {
    author,
    name,
    description,
    sportType,
    lengthType,
    tags,
    intervals,
  }: Workout,
  mode: WorkoutMode
): string {
  let xml = Builder.begin()
    .ele("workout_file")
    .ele("author", author)
    .up()
    .ele("name", name)
    .up()
    .ele("description", description)
    .up()
    .ele("sportType", sportType)
    .up()
    .ele("durationType", lengthType)
    .up()
    .ele("tags");

  tags.forEach((tag: string) => {
    var t: Builder.XMLNode;
    t = Builder.create("tag").att("name", tag);
    xml.importDocument(t);
  });

  xml = xml.up().ele("workout");

  intervals.forEach((interval, index) => {
    var segment: Builder.XMLNode;
    var ramp;

    if (interval.type === "steady") {
      segment = Builder.create("SteadyState")
        .att("Duration", mode.fromLength(interval.length))
        .att("Power", interval.intensity)
        .att("pace", interval.pace);

      // add cadence if not zero
      interval.cadence !== 0 && segment.att("Cadence", interval.cadence);
    } else if (
      interval.type === "ramp" &&
      interval.startIntensity &&
      interval.endIntensity
    ) {
      // index 0 is warmup
      // last index is cooldown
      // everything else is ramp

      ramp = "Ramp";
      if (index === 0) ramp = "Warmup";
      if (index === intervals.length - 1) ramp = "Cooldown";

      if (interval.startIntensity < interval.endIntensity) {
        // warmup
        segment = Builder.create(ramp)
          .att("Duration", mode.fromLength(interval.length))
          .att("PowerLow", interval.startIntensity)
          .att("PowerHigh", interval.endIntensity)
          .att("pace", interval.pace);
        interval.cadence !== undefined &&
          segment.att("Cadence", interval.cadence);
      } else {
        // cooldown
        segment = Builder.create(ramp)
          .att("Duration", mode.fromLength(interval.length))
          .att("PowerLow", interval.startIntensity) // these 2 values are inverted
          .att("PowerHigh", interval.endIntensity) // looks like a bug on zwift editor
          .att("pace", interval.pace);
        interval.cadence !== undefined &&
          segment.att("Cadence", interval.cadence);
      }
    } else if (interval.type === "repetition") {
      // <IntervalsT Repeat="5" OnDuration="60" OffDuration="300" OnPower="0.8844353" OffPower="0.51775455" pace="0"/>
      segment = Builder.create("IntervalsT")
        .att("Repeat", interval.repeat)
        .att("OnDuration", mode.fromLength(interval.onLength))
        .att("OffDuration", mode.fromLength(interval.offLength))
        .att("OnPower", interval.onIntensity)
        .att("OffPower", interval.offIntensity)
        .att("pace", interval.pace);
      interval.onCadence !== undefined &&
        segment.att("Cadence", interval.onCadence);
      interval.offCadence !== undefined &&
        segment.att("CadenceResting", interval.offCadence);
    } else {
      // free ride
      segment = Builder.create("FreeRide")
        .att("Duration", mode.fromLength(interval.length))
        .att("FlatRoad", 0); // Without this, Zwift will adjust resistance when gradient changes
      interval.cadence !== undefined &&
        segment.att("Cadence", interval.cadence);
    }

    const intervalLength = (interval: Interval): number =>
      mode instanceof RunMode && mode.lengthType === "distance"
        ? mode.intervalDistance(interval).meters
        : mode.intervalDuration(interval).seconds;

    const instructionInsideInterval = (instruction: Instruction): boolean =>
      mode.fromLength(instruction.offset) >= 0 &&
      mode.fromLength(instruction.offset) < intervalLength(interval);

    // add instructions if present
    interval.instructions.filter(instructionInsideInterval).forEach((i) => {
      segment.ele("textevent", {
        timeoffset: mode.fromLength(i.offset),
        message: i.text,
      });
    });

    xml.importDocument(segment);
  });

  return xml.end({ pretty: true });
}

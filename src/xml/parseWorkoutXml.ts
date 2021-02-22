import Converter from "xml-js";
import { v4 as uuidv4 } from "uuid";
import intervalFactory from "../interval/intervalFactory";
import { createEmptyWorkout, Workout } from "../types/Workout";
import { Distance, Duration, Length } from "../types/Length";
import { WorkoutMode } from "../modes/WorkoutMode";
import { Instruction } from "../types/Instruction";

export default function parseWorkoutXml(
  data: string,
  mode: WorkoutMode
): Workout {
  const workout: Workout = createEmptyWorkout(mode.sportType, mode.lengthType);

  data = data.replace(/<!--(.*?)-->/gm, "");

  const workout_file = Converter.xml2js(data).elements[0];

  if (workout_file.name !== "workout_file") {
    throw new Error("Invalid ZWO file");
  }

  const sportTypeIndex = workout_file.elements.findIndex(
    (element: { name: string }) => element.name === "sportType"
  );
  if (sportTypeIndex !== -1 && workout_file.elements[sportTypeIndex].elements) {
    workout.sportType = workout_file.elements[sportTypeIndex].elements[0].text;
  }

  const lengthTypeIndex = workout_file.elements.findIndex(
    (element: { name: string }) => element.name === "durationType"
  );
  if (
    lengthTypeIndex !== -1 &&
    workout_file.elements[lengthTypeIndex].elements
  ) {
    workout.lengthType =
      workout_file.elements[lengthTypeIndex].elements[0].text;
  }

  const authorIndex = workout_file.elements.findIndex(
    (element: { name: string }) => element.name === "author"
  );
  if (authorIndex !== -1 && workout_file.elements[authorIndex].elements) {
    workout.author = workout_file.elements[authorIndex].elements[0].text;
  }

  const nameIndex = workout_file.elements.findIndex(
    (element: { name: string }) => element.name === "name"
  );
  if (nameIndex !== -1 && workout_file.elements[nameIndex].elements) {
    workout.name = workout_file.elements[nameIndex].elements[0].text;
  }

  const descriptionIndex = workout_file.elements.findIndex(
    (element: { name: string }) => element.name === "description"
  );
  if (
    descriptionIndex !== -1 &&
    workout_file.elements[descriptionIndex].elements
  ) {
    workout.description =
      workout_file.elements[descriptionIndex].elements[0].text;
  }

  const tagsIndex = workout_file.elements.findIndex(
    (element: { name: string }) => element.name === "tags"
  );
  if (tagsIndex !== -1 && workout_file.elements[tagsIndex].elements) {
    workout.tags = workout_file.elements[tagsIndex].elements.map(
      (el: { attributes: { name: string } }) => el.attributes.name
    );
  }

  const workoutEl = workout_file.elements.find(
    (element: { name: string }) =>
      element.name === "workout" && "elements" in element
  );
  if (!workoutEl) {
    return workout;
  }

  const toLength = (x: number) =>
    workout.lengthType === "time" ? Duration(x) : Distance(x);

  workoutEl.elements.map(
    (w: {
      name: string;
      attributes: {
        Power: any;
        PowerLow: string;
        Duration: string;
        PowerHigh: string;
        Cadence?: string;
        CadenceResting?: string;
        Repeat: string;
        OnDuration: string;
        OffDuration: string;
        OnPower: string;
        OffPower: string;
        pace: string;
      };
      elements: any;
    }) => {
      if (w.name === "SteadyState") {
        workout.intervals.push(
          intervalFactory.steady(
            {
              intensity: parseFloat(
                w.attributes.Power || w.attributes.PowerLow
              ),
              length: toLength(parseFloat(w.attributes.Duration)),
              cadence: w.attributes.Cadence
                ? parseFloat(w.attributes.Cadence)
                : undefined,
              pace: parseInt(w.attributes.pace || "0"),
              instructions: textEventsToInstructions(w.elements, toLength),
            },
            mode
          )
        );
      }
      if (w.name === "Ramp" || w.name === "Warmup" || w.name === "Cooldown") {
        workout.intervals.push(
          intervalFactory.ramp(
            {
              startIntensity: parseFloat(w.attributes.PowerLow),
              endIntensity: parseFloat(w.attributes.PowerHigh),
              length: toLength(parseFloat(w.attributes.Duration)),
              pace: parseInt(w.attributes.pace || "0"),
              cadence: w.attributes.Cadence
                ? parseFloat(w.attributes.Cadence)
                : undefined,
              instructions: textEventsToInstructions(w.elements, toLength),
            },
            mode
          )
        );
      }
      if (w.name === "IntervalsT") {
        workout.intervals.push(
          intervalFactory.repetition(
            {
              repeat: parseFloat(w.attributes.Repeat),
              onLength: toLength(parseFloat(w.attributes.OnDuration)),
              offLength: toLength(parseFloat(w.attributes.OffDuration)),
              onIntensity: parseFloat(w.attributes.OnPower),
              offIntensity: parseFloat(w.attributes.OffPower),
              onCadence: w.attributes.Cadence
                ? parseFloat(w.attributes.Cadence)
                : undefined,
              offCadence: w.attributes.CadenceResting
                ? parseFloat(w.attributes.CadenceResting)
                : undefined,
              pace: parseInt(w.attributes.pace || "0"),
              instructions: textEventsToInstructions(w.elements, toLength),
            },
            mode
          )
        );
      }
      if (w.name === "FreeRide") {
        workout.intervals.push(
          intervalFactory.free(
            {
              length: toLength(parseFloat(w.attributes.Duration)),
              cadence: w.attributes.Cadence
                ? parseFloat(w.attributes.Cadence)
                : undefined,
              instructions: textEventsToInstructions(w.elements, toLength),
            },
            mode
          )
        );
      }

      // map functions expect return value
      return false;
    }
  );

  return workout;
}

type TextElement = {
  name: string;
  attributes: { message: string | undefined; timeoffset: string };
};

function textEventsToInstructions(
  textElements: TextElement[] | undefined,
  toLength: (n: number) => Length
): Instruction[] {
  if (!textElements || textElements.length === 0) {
    return [];
  }

  return textElements
    .filter((t) => t.name.toLowerCase() === "textevent")
    .map((t) => ({
      text: t.attributes.message || "",
      offset: toLength(parseFloat(t.attributes.timeoffset)),
      id: uuidv4(),
    }));
}

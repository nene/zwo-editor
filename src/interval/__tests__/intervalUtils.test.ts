import {
  moveInterval,
  updateIntervalLength,
  updateIntervalIntensity,
} from "../intervalUtils";
import { Distance, Duration } from "../../types/Length";
import intervalFactory from "../intervalFactory";
import BikeMode from "../../modes/BikeMode";
import { WorkoutMode } from "../../modes/WorkoutMode";
import RunMode from "../../modes/RunMode";

const defaultBikeMode = () => new BikeMode(200, 75);
const distanceRunMode = () => new RunMode([], "distance");

function deepFreeze<T>(object: T): T {
  for (const name of Object.getOwnPropertyNames(object)) {
    const value = (object as any)[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

// Use freeze to ensure we aren't accidentally mutating our interval list
const defaultIntervals = (mode: WorkoutMode) =>
  deepFreeze([
    intervalFactory.steady(
      {
        id: "#1",
        length: Duration(60),
        intensity: 0.5,
      },
      mode
    ),
    intervalFactory.steady(
      {
        id: "#2",
        length: Duration(120),
        intensity: 1.0,
      },
      mode
    ),
    intervalFactory.steady(
      {
        id: "#3",
        length: Duration(30),
        intensity: 0.75,
      },
      mode
    ),
  ]);

const defaultRunIntervals = (mode: WorkoutMode) =>
  deepFreeze([
    intervalFactory.steady(
      {
        id: "#1",
        length: Distance(1000),
        intensity: 0.5,
      },
      mode
    ),
    intervalFactory.steady(
      {
        id: "#2",
        length: Distance(1200),
        intensity: 1.0,
      },
      mode
    ),
    intervalFactory.steady(
      {
        id: "#3",
        length: Distance(3000),
        intensity: 0.75,
      },
      mode
    ),
  ]);

describe("intervalUtils", () => {
  describe("updateIntervalLength", () => {
    it("increases or decreses duration of specified interval", () => {
      const mode = defaultBikeMode();
      const intervals = defaultIntervals(mode);
      expect(
        updateIntervalLength("#2", Duration(10), intervals, mode)
      ).toMatchSnapshot();
      expect(
        updateIntervalLength("#3", Duration(-10), intervals, mode)
      ).toMatchSnapshot();
    });

    it("increases or decreses distance of specified interval", () => {
      const mode = distanceRunMode();
      const intervals = defaultRunIntervals(mode);
      expect(
        updateIntervalLength("#2", Distance(100), intervals, mode)
      ).toMatchSnapshot();
      expect(
        updateIntervalLength("#3", Distance(-100), intervals, mode)
      ).toMatchSnapshot();
    });

    it("does not allow decreasing duration to zero or below it", () => {
      const mode = defaultBikeMode();
      const intervals = defaultIntervals(mode);
      expect(
        updateIntervalLength("#1", Duration(-65), intervals, mode)
      ).toEqual(intervals);
      expect(
        updateIntervalLength("#1", Duration(-60), intervals, mode)
      ).toEqual(intervals);
    });

    it("does not allow decreasing distance to zero or below it", () => {
      const mode = distanceRunMode();
      const intervals = defaultRunIntervals(mode);
      expect(
        updateIntervalLength("#1", Distance(-1200), intervals, mode)
      ).toEqual(intervals);
      expect(
        updateIntervalLength("#1", Distance(-1000), intervals, mode)
      ).toEqual(intervals);
    });

    it("does nothing when ID not found", () => {
      const mode = defaultBikeMode();
      const intervals = defaultIntervals(mode);
      expect(
        updateIntervalLength("#blah", Duration(10), intervals, mode)
      ).toEqual(intervals);
    });
  });

  describe("updateIntervalIntensity", () => {
    it("increases or decreses duration of specified interval", () => {
      const mode = defaultBikeMode();
      const intervals = defaultIntervals(mode);
      expect(updateIntervalIntensity("#2", 0.05, intervals)).toMatchSnapshot();
      expect(updateIntervalIntensity("#3", -0.05, intervals)).toMatchSnapshot();
    });

    it("does not allow decreasing intensity to zero or below it", () => {
      const mode = defaultBikeMode();
      const intervals = defaultIntervals(mode);
      expect(updateIntervalIntensity("#1", -0.55, intervals)).toEqual(
        intervals
      );
      expect(updateIntervalIntensity("#1", -0.5, intervals)).toEqual(intervals);
    });

    it("does nothing when ID not found", () => {
      const mode = defaultBikeMode();
      const intervals = defaultIntervals(mode);
      expect(updateIntervalIntensity("#blah", 0.1, intervals)).toEqual(
        intervals
      );
    });
  });

  describe("moveInterval", () => {
    it("moves interval index by +1 or -1", () => {
      const mode = defaultBikeMode();
      const intervals = defaultIntervals(mode);
      expect(moveInterval("#2", -1, intervals)).toMatchSnapshot();
      expect(moveInterval("#2", +1, intervals)).toMatchSnapshot();
    });

    it("does not allow moving past start or end", () => {
      const mode = defaultBikeMode();
      const intervals = defaultIntervals(mode);
      expect(moveInterval("#1", -1, intervals)).toEqual(intervals);
      expect(moveInterval("#3", +1, intervals)).toEqual(intervals);
    });

    it("does nothing when ID not found", () => {
      const mode = defaultBikeMode();
      const intervals = defaultIntervals(mode);
      expect(moveInterval("#blah", 1, intervals)).toEqual(intervals);
    });
  });
});

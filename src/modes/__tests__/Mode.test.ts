import intervalFactory from "../../interval/intervalFactory";
import { Distance, Duration } from "../../types/Length";
import { PaceType } from "../../types/PaceType";
import BikeMode from "../BikeMode";
import RunMode from "../RunMode";
import { WorkoutMode } from "../WorkoutMode";

const defaultBikeMode = () => new BikeMode(200, 75);

const defaultRunMode = () => new RunMode([0, 300, 0, 0, 0], "time");

const defaultRunDistanceMode = () => new RunMode([0, 300, 0, 0, 0], "distance");

const allModes = (): WorkoutMode[] => [defaultBikeMode(), defaultRunMode()];

describe("Mode", () => {
  it("intensityToHeight() converts intensity to height in pixels and heightToIntensity() does the opposite", () => {
    allModes().forEach((mode) => {
      [0.5, 0, 1.0, 1.2345, 1.777].forEach((intensity) => {
        expect(
          mode.heightToIntensity(mode.intensityToHeight(intensity))
        ).toEqual(intensity);
      });
    });
  });

  describe("lengthToWidth()", () => {
    it("converts duration to pixels", () => {
      allModes().forEach((mode) => {
        expect(mode.lengthToWidth(Duration(60))).toEqual(20);
      });
    });

    it("converts distance to pixels in RunMode", () => {
      expect(defaultRunDistanceMode().lengthToWidth(Distance(200))).toEqual(20);
    });
  });

  describe("widthToLength()", () => {
    it("converts pixels to duration in BikeMode", () => {
      expect(defaultBikeMode().widthToLength(20)).toEqual(Duration(60));
    });

    it("converts pixels to duration in RunMode", () => {
      expect(defaultRunMode().widthToLength(20)).toEqual(Duration(60));
    });

    it("converts pixels to distance in RunMode@distance", () => {
      expect(defaultRunDistanceMode().widthToLength(20)).toEqual(Distance(200));
    });
  });

  describe("fromLength()", () => {
    it("converts Duration to seconds", () => {
      expect(defaultBikeMode().fromLength(Duration(60))).toBe(60);
    });

    it("converts Distance to meters", () => {
      expect(defaultBikeMode().fromLength(Distance(100))).toBe(100);
    });
  });

  describe("duration()", () => {
    it("returns the value unmodified when given a Duration", () => {
      expect(defaultBikeMode().duration(Duration(60))).toEqual(Duration(60));
      expect(
        defaultRunMode().duration(Duration(60), 1.0, PaceType.fiveKm)
      ).toEqual(Duration(60));
    });

    it("converts Distance to Duration in RunMode, using the recorded runningTimes", () => {
      // when distance exactly 5km, ran at 5km pace
      expect(
        defaultRunMode().duration(Distance(5000), 1.0, PaceType.fiveKm)
      ).toEqual(Duration(300));
      // when distance half of 5km, ran at 5km pace
      expect(
        defaultRunMode().duration(Distance(2500), 1.0, PaceType.fiveKm)
      ).toEqual(Duration(150));
      // when distance exactly 5km, ran at 2 x 5km pace
      expect(
        defaultRunMode().duration(Distance(5000), 2.0, PaceType.fiveKm)
      ).toEqual(Duration(150));
      // 0 distance == 0 duration
      expect(
        defaultRunMode().duration(Distance(0), 1.0, PaceType.fiveKm)
      ).toEqual(Duration(0));
    });

    it("BikeMode does not support Distance", () => {
      expect(() => defaultBikeMode().duration(Distance(200))).toThrow(
        "Unexpected length:Distance encountered in BikeMode"
      );
    });
  });

  describe("intervalDuration()", () => {
    it("in BikeMode returns interval length unmodified when it is of Duration type", () => {
      const mode = defaultBikeMode();

      ["steady" as "steady", "free" as "free", "ramp" as "ramp"].forEach(
        (fname) => {
          const interval = intervalFactory[fname](
            {
              length: Duration(60),
            },
            mode
          );
          expect(mode.intervalDuration(interval)).toEqual(Duration(60));
        }
      );

      const repetition = intervalFactory.repetition(
        {
          repeat: 2,
          onLength: Duration(100),
          offLength: Duration(200),
        },
        mode
      );
      expect(mode.intervalDuration(repetition)).toEqual(Duration(600));
    });

    it("in RunMode returns interval length unmodified when it is of Duration type", () => {
      const mode = defaultRunMode();
      ["steady" as "steady", "ramp" as "ramp", "free" as "free"].forEach(
        (fname) => {
          const interval = intervalFactory[fname](
            {
              length: Duration(60),
            },
            mode
          );
          expect(mode.intervalDuration(interval)).toEqual(Duration(60));
        }
      );

      const repetition = intervalFactory.repetition(
        {
          repeat: 2,
          onLength: Duration(100),
          offLength: Duration(200),
        },
        mode
      );
      expect(mode.intervalDuration(repetition)).toEqual(Duration(600));
    });

    it("in RunMode converts Distance to Duration", () => {
      const mode = defaultRunDistanceMode();

      const steady = intervalFactory.steady(
        {
          length: Distance(5000),
          intensity: 1.0,
          pace: PaceType.fiveKm,
        },
        mode
      );
      expect(mode.intervalDuration(steady)).toEqual(Duration(300));

      const ramp = intervalFactory.ramp(
        {
          length: Distance(5000),
          startIntensity: 0.5,
          endIntensity: 1.0,
          pace: PaceType.fiveKm,
        },
        mode
      );
      expect(mode.intervalDuration(ramp)).toEqual(Duration(400));

      const repetition = intervalFactory.repetition(
        {
          repeat: 2,
          onLength: Distance(2000),
          offLength: Distance(3000),
          onIntensity: 1.0,
          offIntensity: 0.5,
          pace: PaceType.fiveKm,
        },
        mode
      );
      expect(mode.intervalDuration(repetition)).toEqual(Duration(960));
    });

    it("in RunMode converts FreeRide Distance to zero-Duration", () => {
      const mode = defaultRunDistanceMode();
      const free = intervalFactory.free(
        {
          length: Distance(2000),
        },
        mode
      );
      expect(mode.intervalDuration(free)).toEqual(Duration(0));
    });

    it("in BikeMode Distance is not supported", () => {
      const mode = defaultBikeMode();
      const interval = intervalFactory.steady(
        {
          length: Distance(400),
        },
        mode
      );
      expect(() => mode.intervalDuration(interval)).toThrow(
        "Unexpected length:Distance encountered in BikeMode"
      );
    });

    describe("intervalLength()", () => {
      it("always returns duration in BikeMode", () => {
        const mode = defaultBikeMode();
        const interval = intervalFactory.steady(
          {
            length: Duration(120),
          },
          mode
        );
        expect(mode.intervalLength(interval)).toEqual(Duration(120));
      });

      it("returns duration in RunMode/lengthType=time", () => {
        const mode = defaultRunMode();
        const interval = intervalFactory.steady(
          {
            length: Distance(100),
            pace: PaceType.fiveKm,
          },
          mode
        );
        expect(mode.intervalLength(interval)).toEqual(Duration(6));
      });

      it("returns distance in RunMode/lengthType=distance", () => {
        const mode = defaultRunDistanceMode();
        const interval = intervalFactory.steady(
          {
            length: Duration(6),
            pace: PaceType.fiveKm,
          },
          mode
        );
        expect(mode.intervalLength(interval)).toEqual(Distance(100));
      });
    });
  });

  describe("BikeMode", () => {
    it("power() converts intensity to power using FTP", () => {
      expect(defaultBikeMode().power(0)).toEqual(0);
      expect(defaultBikeMode().power(1.5)).toEqual(300);
      expect(defaultBikeMode().power(1.12345)).toEqual(224.69);
    });

    it("wkg() converts intensity to w/kg using FTP and weight", () => {
      expect(defaultBikeMode().wkg(0)).toEqual(0);
      expect(defaultBikeMode().wkg(1.5)).toEqual(4);
      expect(defaultBikeMode().wkg(1.1)).toEqual(2.9333333333333336);
    });
  });

  describe("RunMode", () => {
    it("speed() converts intensity & pace type to speed in m/s", () => {
      expect(defaultRunMode().speed(0, PaceType.fiveKm)).toEqual(0);
      expect(defaultRunMode().speed(0.3, PaceType.fiveKm)).toEqual(5);
      expect(defaultRunMode().speed(1.3, PaceType.fiveKm)).toEqual(
        21.666666666666668
      );
    });

    describe("distance()", () => {
      it("converts duration to distance", () => {
        expect(
          defaultRunMode().distance(Duration(60), 0, PaceType.fiveKm)
        ).toEqual(Distance(0));
        expect(
          defaultRunMode().distance(Duration(60), 1.0, PaceType.fiveKm)
        ).toEqual(Distance(1000.0000000000001));
        expect(
          defaultRunMode().distance(Duration(59.876), 1.0, PaceType.fiveKm)
        ).toEqual(Distance(997.93333333333334));
      });

      it("keeps distance unchanged", () => {
        expect(
          defaultRunMode().distance(Distance(200), 1.0, PaceType.fiveKm)
        ).toEqual(Distance(200));
      });
    });

    describe("intervalDistance()", () => {
      describe("in duration mode", () => {
        it("calculates steady interval distance", () => {
          const mode = defaultRunMode();
          const interval = intervalFactory.steady(
            {
              length: Duration(60),
              intensity: 1.0,
              pace: PaceType.fiveKm,
            },
            mode
          );
          expect(mode.intervalDistance(interval)).toEqual(
            Distance(1000.0000000000001)
          );
        });

        it("calculates ramp interval distance", () => {
          const mode = defaultRunMode();
          const interval = intervalFactory.ramp(
            {
              length: Duration(60),
              startIntensity: 0.5,
              endIntensity: 1.0,
              pace: PaceType.fiveKm,
            },
            mode
          );
          expect(mode.intervalDistance(interval)).toEqual(Distance(750));
        });

        it("converts free interval duration to zero-distance", () => {
          const mode = defaultRunMode();
          const free = intervalFactory.free(
            {
              length: Duration(2000),
            },
            mode
          );
          expect(mode.intervalDistance(free)).toEqual(Distance(0));
        });

        it("calculates repetition interval distance", () => {
          const mode = defaultRunMode();
          const interval = intervalFactory.repetition(
            {
              repeat: 3,
              onLength: Duration(60),
              offLength: Duration(60),
              onIntensity: 1.0,
              offIntensity: 0.5,
              pace: PaceType.fiveKm,
            },
            mode
          );
          expect(mode.intervalDistance(interval)).toEqual(
            Distance(4500.000000000001)
          );
        });
      });

      describe("in distance mode", () => {
        it("returns steady interval distance as-is", () => {
          const mode = defaultRunDistanceMode();
          const interval = intervalFactory.steady(
            {
              length: Distance(200),
            },
            mode
          );
          expect(mode.intervalDistance(interval)).toEqual(Distance(200));
        });

        it("returns ramp distance as-is", () => {
          const mode = defaultRunDistanceMode();
          const interval = intervalFactory.ramp(
            {
              length: Distance(400),
            },
            mode
          );
          expect(mode.intervalDistance(interval)).toEqual(Distance(400));
        });

        it("sums and multiplies repetition interval distances", () => {
          const mode = defaultRunDistanceMode();
          const interval = intervalFactory.repetition(
            {
              repeat: 5,
              onLength: Distance(400),
              offLength: Distance(600),
            },
            mode
          );
          expect(mode.intervalDistance(interval)).toEqual(Distance(5000));
        });
      });
    });
  });
});

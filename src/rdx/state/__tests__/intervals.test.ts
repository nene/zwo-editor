import intervalFactory from "../../../interval/intervalFactory";
import BikeMode from "../../../modes/BikeMode";
import { Duration } from "../../../types/Length";
import { reducer, removeInterval } from "../intervals";

const defaultMode = () => new BikeMode(200, 75);

describe("intervals reducer", () => {
  describe("removeInterval()", () => {
    it("removes interval with given ID", () => {
      const state = [
        intervalFactory.steady(
          {
            id: "#1",
            length: Duration(60),
            intensity: 0.5,
            instructions: [],
          },
          defaultMode()
        ),
        intervalFactory.steady(
          {
            id: "#2",
            length: Duration(60),
            intensity: 0.5,
            instructions: [],
          },
          defaultMode()
        ),
      ];
      expect(reducer(state, removeInterval("#2"))).toMatchSnapshot();
    });
  });
});

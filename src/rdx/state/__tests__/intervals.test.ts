import intervalFactory from "../../../interval/intervalFactory";
import BikeMode from "../../../modes/BikeMode";
import { Duration } from "../../../types/Length";
import {
  reducer,
  removeInterval,
  removeInstruction,
  updateInstruction,
  addInstruction,
} from "../intervals";

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

  describe("removeInstruction()", () => {
    it("removes instruction with given ID", () => {
      const state = [
        intervalFactory.steady(
          {
            id: "#1",
            length: Duration(60),
            intensity: 0.5,
            instructions: [
              {
                id: "inst-1",
                offset: Duration(0),
                text: "Hello",
              },
              {
                id: "inst-2",
                offset: Duration(10),
                text: "World",
              },
              {
                id: "inst-3",
                offset: Duration(20),
                text: "!",
              },
            ],
          },
          defaultMode()
        ),
      ];
      expect(
        reducer(
          state,
          removeInstruction({ intervalId: "#1", instructionId: "inst-2" })
        )
      ).toMatchSnapshot();
    });
  });

  describe("updateInstruction()", () => {
    it("overwrites instruction with same ID", () => {
      const state = [
        intervalFactory.steady(
          {
            id: "#1",
            length: Duration(60),
            intensity: 0.5,
            instructions: [
              {
                id: "inst-1",
                offset: Duration(0),
                text: "Hello",
              },
              {
                id: "inst-2",
                offset: Duration(10),
                text: "World",
              },
              {
                id: "inst-3",
                offset: Duration(20),
                text: "!",
              },
            ],
          },
          defaultMode()
        ),
      ];
      expect(
        reducer(
          state,
          updateInstruction({
            intervalId: "#1",
            instruction: {
              id: "inst-3",
              offset: Duration(30),
              text: "Oh yeah!",
            },
          })
        )
      ).toMatchSnapshot();
    });
  });

  describe("addInstruction()", () => {
    it("adds instruction to specified interval", () => {
      const state = [
        intervalFactory.steady(
          {
            id: "#1",
            length: Duration(60),
            intensity: 0.5,
            instructions: [
              {
                id: "inst-1",
                offset: Duration(0),
                text: "Hello",
              },
            ],
          },
          defaultMode()
        ),
      ];
      expect(
        reducer(
          state,
          addInstruction({
            intervalId: "#1",
            instruction: {
              id: "inst-2",
              offset: Duration(40),
              text: "A new one",
            },
          })
        )
      ).toMatchSnapshot();
    });
  });
});

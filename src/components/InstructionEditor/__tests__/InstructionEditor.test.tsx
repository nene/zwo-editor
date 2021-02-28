import React from "react";
import InstructionEditor from "../InstructionEditor";
import renderer from "react-test-renderer";
import { createInstruction } from "../../../types/Instruction";
import createMode from "../../../modes/createMode";
import { Duration } from "../../../types/Length";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

describe("InstructionEditor", () => {
  let component: renderer.ReactTestRenderer;

  beforeEach(() => {
    const mode = createMode({
      sportType: "bike",
      ftp: 200,
      weight: 75,
      runningTimes: [],
      lengthType: "time",
    });
    const instruction = createInstruction(
      {
        text: "This is a comment",
        offset: Duration(300),
      },
      mode
    );

    component = renderer.create(
      <InstructionEditor
        instruction={instruction}
        width={500}
        index={0}
        onChange={() => {}}
        onDelete={() => {}}
        mode={mode}
      />
    );
  });

  it("renders vertical line and icon", () => {
    expect(component).toMatchSnapshot();
  });

  it("shows the editor when icon clicked", () => {
    renderer.act(() => {
      component.root.findByType(FontAwesomeIcon).props.onMouseDown();
    });

    expect(component).toMatchSnapshot();
  });
});
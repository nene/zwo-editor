import React from "react";
import { Label } from "../Label/Label";
import "./Checkbox.css";

const Checkbox = (props: {
  label: string;
  isSelected: boolean;
  onCheckboxChange: Function;
}) => (
  <div className="form-check">
    <Label>
      <input
        type="checkbox"
        name={props.label}
        checked={props.isSelected}
        onChange={(e) => props.onCheckboxChange()}
        className="form-check-input"
      />
      {props.label}
    </Label>
  </div>
);

export default Checkbox;

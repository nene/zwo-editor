import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Switch from "react-switch";
import styled from "styled-components";
import { Column } from "../Layout/Column";
import "./LeftRightToggle.css";

interface LeftRightToggleProps<TLeft,TRight> {
  label: string;
  leftValue: TLeft;
  rightValue: TRight;
  leftIcon: IconProp;
  rightIcon: IconProp;
  selected: TLeft | TRight;
  onChange: (selected: TLeft | TRight) => void;
}

const COLOR = "#00C46A";

const LeftRightToggle = <TLeft,TRight>({ label, leftValue, rightValue, leftIcon, rightIcon, selected, onChange }: LeftRightToggleProps<TLeft,TRight>) => (
  <Col>
    <label>{label}</label>
    <div className="left-right-toggle">
      <FontAwesomeIcon
        className={`icon ${selected === leftValue ? "active" : ""}`}
        icon={leftIcon}
        size="lg"
        fixedWidth
      />
      <Switch
        onChange={() => onChange(selected === leftValue ? rightValue : leftValue)}
        checked={selected === rightValue}
        checkedIcon={false}
        uncheckedIcon={false}
        onColor={COLOR}
        offColor={COLOR}
      />
      <FontAwesomeIcon
        className={`icon ${selected === rightValue ? "active" : ""}`}
        icon={rightIcon}
        size="lg"
        fixedWidth
      />
    </div>
  </Col>
);

const Col = styled(Column)`
  max-width: 120px;  
  padding: 0 10px;
`;

export default LeftRightToggle;

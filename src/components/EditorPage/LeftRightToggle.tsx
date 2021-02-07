import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Switch from "react-switch";
import styled from "styled-components";
import { Column } from "../Layout/Column";
import { Label } from "../Label/Label";

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
    <Label>{label}</Label>
    <LeftRight>
      <ToggleIcon
        active={selected === leftValue}
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
      <ToggleIcon
        active={selected === rightValue}
        icon={rightIcon}
        size="lg"
        fixedWidth
      />
    </LeftRight>
  </Col>
);

const Col = styled(Column)`
  max-width: 120px;  
  padding: 0 10px;
`;

const LeftRight = styled.div`
  display: flex;
  flex-direction: row;
  color: lightgray;
`;

const ToggleIcon = styled(FontAwesomeIcon)<{active: boolean}>`
  padding: 5px;
  color: ${({active}) => active ? '#00C46A' : 'inherit'};
`;

export default LeftRightToggle;

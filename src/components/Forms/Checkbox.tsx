import React from "react";
import styled from "styled-components";
import { Label } from "../Label/Label";

const Checkbox = (props: {
  label: string;
  isSelected: boolean;
  onCheckboxChange: Function;
}) => (
  <Container>
    <CheckboxLabel>
      <input
        type="checkbox"
        name={props.label}
        checked={props.isSelected}
        onChange={(e) => props.onCheckboxChange()}
        className="form-check-input"
      />
      {props.label}
    </CheckboxLabel>
  </Container>
);

const Container = styled.div`
  display: inline-block;
  padding: 10px 10px 10px 0;
`;

const CheckboxLabel = styled(Label)`
  font-size: 16px;
  color: gray;
`;

export default Checkbox;

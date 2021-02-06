import React from "react";
import styled from "styled-components";
import { Column } from "../Layout/Column";

// Displays workut name, description & author

interface NumberFieldProps {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({ name, label, value, onChange}) => {
  return (
    <Col>
      <label htmlFor={name}>{label}</label>
      <TextInput
        type="number"
        name={name}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </Col>
  );
};

const TextInput = styled.input`
  font-size: 20px;
  border: 1px solid lightgray;  
  text-align: center;
`;

const Col = styled(Column)`
  max-width: 100px;
`;

export default NumberField;

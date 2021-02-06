import React from "react";
import styled from "styled-components";

// Displays workut name, description & author

interface NumberFieldProps {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({ name, label, value, onChange}) => {
  return (
    <div className="form-input">
      <label htmlFor={name}>{label}</label>
      <TextInput
        type="number"
        name={name}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );
};

const TextInput = styled.input`
  font-size: 20px;
  border: 1px solid lightgray;  
  text-align: center;
`;

export default NumberField;

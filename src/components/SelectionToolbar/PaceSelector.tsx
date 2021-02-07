import React from "react";
import styled from "styled-components";
import { PaceType } from "../../types/PaceType";

interface PaceSelectorProps {
  value?: PaceType;
  onChange: (value: PaceType) => void;
}

const PaceSelector = ({ value, onChange }: PaceSelectorProps) => (
  <StyledSelect
    name="pace"
    value={value}
    onChange={(e) => onChange(parseInt(e.target.value))}
  >
    <option value="0">1 Mile Pace</option>
    <option value="1">5K Pace</option>
    <option value="2">10K Pace</option>
    <option value="3">Half Marathon Pace</option>
    <option value="4">Marathon Pace</option>
  </StyledSelect>
);

const StyledSelect = styled.select`
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
`;

export default PaceSelector;

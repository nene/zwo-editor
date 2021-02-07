import styled from "styled-components";
import Button from "./Button";

const ColorButton = styled(Button)<{ color: string }>`
  color: white;
  width: 50px;
  height: 50px;
  background-color: ${(props) => props.color};
`;

export default ColorButton;

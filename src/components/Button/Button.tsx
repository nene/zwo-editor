import styled from "styled-components";

const Button = styled.button`
  display: inline-block;
  background-color: white;
  border: none;
  text-align: center;
  font-size: 13px;
  border-radius: 5px;
  min-width: 50px;
  box-shadow: 2px 2px 5px #bbb;
  cursor: pointer;

  &:hover {
    box-shadow: 2px 2px 5px #999;
  }
  &:active {
    position: relative;
    top: 1px;
    left: 1px;
  }
`;

export default Button;

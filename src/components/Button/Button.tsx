import styled from "styled-components";

const Button = styled.button`
  display: inline-block;
  background-color: white;
  border: 1px solid lightgray;
  text-align: center;
  font-size: 13px;
  border-radius: 5px;
  min-width: 50px;

  & > svg {
    display: block;
    margin: 0 auto;
  }
`;

export default Button;

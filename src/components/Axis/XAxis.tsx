import styled from "styled-components";

export const XAxis = styled.div<{ width: number }>`
  position: absolute;
  bottom: 0px;
  border-top: 1px solid gray;
  overflow: hidden;
  min-width: 1320px;
  width: ${({ width }) => width}px;
`;

export const XAxisValue = styled.span`
  position: relative;
  display: inline-block;
  margin-top: 20px;
  padding: 0;

  &::before {
    content: "";
    position: absolute;
    width: 1px;
    height: 10px;
    top: -20px;
    left: 0;
    background-color: gray;
  }
`;

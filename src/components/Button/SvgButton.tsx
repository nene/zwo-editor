import React from "react";
import styled from "styled-components";
import Button from "./Button";

type SvgComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & { title?: string }
>;

interface SvgButtonProps {
  svg: SvgComponent;
  onClick: () => void;
}

const SvgButton: React.FC<SvgButtonProps> = ({ svg, children, onClick }) => {
  return (
    <Button onClick={onClick}>
      <StyledSvg as={svg} /> {children}
    </Button>
  );
};

const StyledSvg = styled.svg`
  width: 30px;
  margin: 0 auto;
  display: block;
  margin: 0 auto;
`;

export default SvgButton;

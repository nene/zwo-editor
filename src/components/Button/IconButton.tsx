import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import styled from "styled-components";

interface IconButtonProps {
  icon: IconDefinition;
  children: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, children, onClick }) => {
  return (
    <Button onClick={onClick}>
      <StyledIcon icon={icon} size="lg" fixedWidth /> {children}
    </Button>
  );
};

const StyledIcon = styled(FontAwesomeIcon)`
  display: block;
  margin: 0 auto;
`;

export default IconButton;

import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

interface ActionButtonProps {
  title: string;
  icon: IconDefinition;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, icon, onClick }) => {
  return (
    <RoundButton onClick={onClick} title={title}>
      <FontAwesomeIcon icon={icon} size="lg" fixedWidth />
    </RoundButton>
  );
};

const RoundButton = styled.button`
  padding: 20px;
  margin: 0 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: 0;
  border-radius: 50%;
`;

export default ActionButton;

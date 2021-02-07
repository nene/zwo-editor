import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

interface IconButtonProps {
  icon: IconDefinition;
  children: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, children, onClick }) => {
  return (
    <Button onClick={onClick}>
      <FontAwesomeIcon icon={icon} size="lg" fixedWidth /> {children}
    </Button>
  );
};

export default IconButton;

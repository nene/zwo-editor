import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface IconButtonProps {
  icon: IconDefinition;
  children: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, children, onClick }) => {
  return (
    <button className="btn" onClick={onClick}>
      <FontAwesomeIcon icon={icon} size="lg" fixedWidth /> {children}
    </button>
  );
};

export default IconButton;

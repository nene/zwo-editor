import React from "react";

interface ColorButtonProps {
  color: string;
  children: string;
  onClick: () => void;
}

const ColorButton: React.FC<ColorButtonProps> = ({ color, children, onClick }) => {
  return (
    <button className="btn btn-square" onClick={onClick} style={{ backgroundColor: color }}>
      {children}
    </button>
  );
};

export default ColorButton;

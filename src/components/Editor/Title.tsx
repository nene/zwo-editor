import React from "react";

// Displays workut name, description & author

interface TitleProps {
  name: string;
  description: string;
  author: string;
  onClick: () => void;
}

const Title: React.FC<TitleProps> = ({ name, author, description, onClick }) => {
  return (
    <div className="title" onClick={onClick}>
      <h1>{name}</h1>
      <div className="description">{description}</div>
      <p>{author ? `by ${author}` : ''}</p>
    </div>
  );
};

export default Title;

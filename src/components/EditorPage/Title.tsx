import React from "react";
import styled from "styled-components";

// Displays workut name, description & author

interface TitleProps {
  name: string;
  description: string;
  author: string;
  onClick: () => void;
}

const Title: React.FC<TitleProps> = ({ name, author, description, onClick }) => {
  return (
    <Container onClick={onClick}>
      <Heading>{name}</Heading>
      <div>{description}</div>
      <Author>{author ? `by ${author}` : ''}</Author>
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  cursor: pointer;
`;

const Heading = styled.h1`
  padding: 10px 0;
  margin: 0;
`;

const Author = styled.p`
  font-style: italic;
  margin: 10px 0 0 0;
`;

export default Title;

import React from "react";
import styled from "styled-components";
import { GITHUB_URL } from "../../const";

export default function Footer() {
  return (
    <Container>
      <List>
        <Item>
          Zwift Workout v1.7 (
          <a href={`${GITHUB_URL}/blob/master/LICENSE.md`} target="blank">
            open source / MIT license
          </a>
          )
        </Item>
        <Item>
          <a href={`${GITHUB_URL}/issues`} target="blank">
            Report an issue
          </a>
        </Item>
      </List>
    </Container>
  );
}

const Container = styled.div`
  padding: 10px;
  font-size: 12px;
  text-align: center;
  background-color: black;
  color: white;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Item = styled.li`
  display: inline;
  padding: 0 10px;
  margin: 0;
`;

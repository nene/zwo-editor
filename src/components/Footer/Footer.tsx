import React from "react";
import styled from "styled-components";
import { GITHUB_URL } from "../../const";

export default function Footer() {
  return (
    <Container>
      <List>
        <Item>
          Zwift Workout v1.7 (
          <Hyperlink
            href={`${GITHUB_URL}/blob/master/LICENSE.md`}
            target="blank"
          >
            open source / MIT license
          </Hyperlink>
          )
        </Item>
        <Item>
          <Hyperlink href={`${GITHUB_URL}/issues`} target="blank">
            Report an issue
          </Hyperlink>
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

const Hyperlink = styled.a`
  text-decoration: none;
  color: #00c46a;
`;

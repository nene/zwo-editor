import React from "react";
import styled from "styled-components";
import { Instruction } from "../../types/Instruction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cadenceImage from "../../assets/cadence.png";
import { faComment } from "@fortawesome/free-solid-svg-icons";

export const BarIcons: React.FC<{
  cadence?: number;
  instructions: Instruction[];
  height: number;
  className?: string;
}> = ({ cadence, instructions, height, className }) => (
  <IconsWrap className={className} $height={height}>
    {cadence && (
      <IconLine>
        <img src={cadenceImage} alt="Has cadence" width="16" />
        <span>{cadence}</span>
      </IconLine>
    )}
    {instructions.length > 0 && (
      <IconLine>
        <FontAwesomeIcon
          icon={faComment}
          size="sm"
          fixedWidth={true}
          color="white"
        />
        <span>{instructions.length}</span>
      </IconLine>
    )}
  </IconsWrap>
);

const IconsWrap = styled.div<{ $height: number }>`
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  padding: 2px;
  color: white;
  height: ${(p) => p.$height}px;
`;

const IconLine = styled.div`
  display: flex;
  align-items: center;
  & > span {
    padding-left: 5px;
  }
`;

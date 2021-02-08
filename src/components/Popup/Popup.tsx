import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "./Popup.css";
import styled from "styled-components";

const Popup: React.FC<{
  width: string;
  height?: string;
  onClose: () => void;
}> = (props) => {
  return (
    <Background>
      <Window style={{ width: props.width, height: props.height }}>
        <CloseButton onClick={props.onClose}>
          <FontAwesomeIcon icon={faTimesCircle} size="lg" fixedWidth />
        </CloseButton>
        {props.children}
      </Window>
    </Background>
  );
};

const Background = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

const Window = styled.div`
  position: fixed;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  padding: 10px;

  align-self: center;
  margin: 0 auto;
  background-color: white;
  border-radius: 5px;

  box-shadow: -5px 1px 51px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: -5px 1px 51px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: -5px 1px 51px 0px rgba(0, 0, 0, 0.75);

  overflow-y: scroll;
`;

const CloseButton = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  float: right;
  color: white;
  position: absolute;
  top: 10px;
  right: 10px;
  color: black;
`;

export default Popup;

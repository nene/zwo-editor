import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "./Popup.css";

const Popup = (props: {
  width: string;
  height?: string;
  onClose: () => void;
  children: any;
}) => {
  return (
    <div className="popup-background">
      <div
        className="popup"
        style={{ width: props.width, height: props.height }}
      >
        <button className="close" onClick={props.onClose}>
          <FontAwesomeIcon icon={faTimesCircle} size="lg" fixedWidth />
        </button>
        {props.children}
      </div>
    </div>
  );
};

export default Popup;

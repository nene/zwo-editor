import React from "react";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import IconButton from "./IconButton";
import parseWorkoutXml from "../../xml/parseWorkoutXml";
import { WorkoutMode } from "../../modes/WorkoutMode";
import { Workout } from "../../types/Workout";

interface UploadButtonProps {
  mode: WorkoutMode;
  onUpload: (workout: Workout) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ mode, onUpload }) => {
  async function handleUpload(file: File) {
    try {
      onUpload(parseWorkoutXml(await file.text(), mode));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <input
        accept=".xml,.zwo"
        id="contained-button-file"
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => handleUpload(e.target.files![0])}
      />
      <IconButton label="Upload" icon={faUpload} onClick={() => document.getElementById("contained-button-file")!.click()} />
    </>
  );
};

export default UploadButton;

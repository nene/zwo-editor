import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  selectAuthor,
  selectDescription,
  selectName,
  selectTags,
  setName,
  setAuthor,
  setDescription,
  setTags,
} from "../../rdx/state/meta";
import { RootState } from "../../rdx/store";
import { ConnectedProps } from "../../types/ConnectedProps";
import { Label } from "../Label/Label";
import Checkbox from "./Checkbox";

const DEFAULT_TAGS = ["Recovery", "Intervals", "FTP", "TT"];

const mapStateToProps = (state: RootState) => ({
  name: selectName(state),
  author: selectAuthor(state),
  description: selectDescription(state),
  tags: selectTags(state),
});

const mapDispatchToProps = {
  setName,
  setAuthor,
  setDescription,
  setTags,
};

type SaveFormProps = ConnectedProps<
  typeof mapStateToProps,
  typeof mapDispatchToProps
>;

function SaveForm(props: SaveFormProps) {
  return (
    <div>
      <Heading>Workout metadata</Heading>
      <Field>
        <FieldLabel htmlFor="name">Workout Title</FieldLabel>
        <TextInput
          type="text"
          id="name"
          placeholder="Workout title"
          value={props.name}
          onChange={(e) => props.setName(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="description">Workout description</FieldLabel>
        <TextInput
          as="textarea"
          id="description"
          placeholder="Workout description"
          value={props.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            props.setDescription(e.target.value)
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="author">Workout Author</FieldLabel>
        <TextInput
          type="text"
          id="author"
          placeholder="Workout Author"
          value={props.author}
          onChange={(e) => props.setAuthor(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Workout Tags</FieldLabel>
        {DEFAULT_TAGS.map((tagName) => (
          <Checkbox
            key={tagName}
            label={tagName}
            isSelected={props.tags.includes(tagName)}
            onCheckboxChange={() =>
              props.setTags(addOrRemoveTag(props.tags, tagName))
            }
          />
        ))}
      </Field>
    </div>
  );
}

function addOrRemoveTag(tags: string[], tagName: string): string[] {
  if (tags.includes(tagName)) {
    return tags.filter((item) => item !== tagName);
  } else {
    return [...tags, tagName];
  }
}

const Heading = styled.h2`
  font-size: 34px;
  font-weight: 200;
  margin: 0;
  text-transform: uppercase;
`;

const Field = styled.div`
  margin: 10px 0;
  width: 100%;
`;

const FieldLabel = styled(Label)`
  font-size: 14px;
  color: gray;
  display: block;
  text-align: left;
`;

const TextInput = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 10px;

  font-size: 16px;
  border: 1px solid #aaa;
  border-radius: 5px;
  box-sizing: border-box;
`;

export default connect(mapStateToProps, mapDispatchToProps)(SaveForm);

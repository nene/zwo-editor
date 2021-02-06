import React from "react";
import { connect } from "react-redux";
import { selectAuthor, selectDescription, selectName, selectTags, setName, setAuthor, setDescription, setTags } from "../../rdx/state/meta";
import { RootState } from "../../rdx/store";
import { ConnectedProps } from "../../types/ConnectedProps";
import Checkbox from "./Checkbox";

const DEFAULT_TAGS = ["Recovery", "Intervals", "FTP", "TT"]

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

type SaveFormProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

function SaveForm(props: SaveFormProps) {
  return (
    <div>
      <h2>Workout metadata</h2>
      <div className="form-control">
        <label htmlFor="name">Workout Title</label>
        <input type="text" name="name" placeholder="Workout title" value={props.name} onChange={(e) => props.setName(e.target.value)} />
      </div>
      <div className="form-control">
        <label htmlFor="description">Workout description</label>
        <textarea name="description" placeholder="Workout description" value={props.description} onChange={(e) => props.setDescription(e.target.value)}></textarea>
      </div>
      <div className="form-control">
        <label htmlFor="author">Workout Author</label>
        <input type="text" name="author" placeholder="Workout Author" value={props.author} onChange={(e) => props.setAuthor(e.target.value)} />
      </div>
      <div className="form-control">
        <label htmlFor="author">Workout Tags</label>
        {DEFAULT_TAGS.map(tagName => (
          <Checkbox
            key={tagName}
            label={tagName}
            isSelected={props.tags.includes(tagName)}
            onCheckboxChange={() => props.setTags(addOrRemoveTag(props.tags, tagName))}
          />
        ))}
      </div>
    </div>
  )
}

function addOrRemoveTag(tags: string[], tagName: string): string[] {
  if (tags.includes(tagName)) {
    return tags.filter(item => item !== tagName)
  } else {
    return [...tags, tagName]
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveForm);

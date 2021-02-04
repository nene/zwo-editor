import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { LengthType } from '../types/LengthType';
import { SportType } from '../types/SportType';
import { Workout } from '../types/Workout';
import { RootState } from './store';
import { clearWorkout, loadWorkout } from './workout';

interface MetaState {
  name: string;
  author: string;
  description: string;
  tags: string[],
  sportType: SportType;
  lengthType: LengthType;
}

const initialState: MetaState = {
  name: "",
  author: "",
  description: "",
  tags: [],
  sportType: "bike",
  lengthType: "time",
};

const slice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => ({ ...state, name: action.payload }),
    setAuthor: (state, action: PayloadAction<string>) => ({ ...state, author: action.payload }),
    setDescription: (state, action: PayloadAction<string>) => ({ ...state, description: action.payload }),
    setTags: (state, action: PayloadAction<string[]>) => ({ ...state, tags: action.payload }),
    setSportType: (state, action: PayloadAction<SportType>) => ({ ...state, sportType: action.payload }),
    setLengthType: (state, action: PayloadAction<LengthType>) => ({ ...state, lengthType: action.payload }),
  },
  extraReducers: {
    [clearWorkout.type]: (state) => ({
      ...state,
      name: "",
      author: "",
      description: "",
      tags: [],
    }),
    [loadWorkout.type]: (state, { payload }: PayloadAction<Workout>) => ({
      name: payload.name,
      author: payload.author,
      description: payload.description,
      tags: payload.tags,
      sportType: payload.sportType,
      lengthType: payload.lengthType,
    }),
  },
});

export const reducer = slice.reducer;
export const { setName, setAuthor, setDescription, setTags, setSportType, setLengthType } = slice.actions;

const selectMeta = (state: RootState) => state.meta;
export const selectName = createSelector(selectMeta, (m) => m.name);
export const selectAuthor = createSelector(selectMeta, (m) => m.author);
export const selectDescription = createSelector(selectMeta, (m) => m.description);
export const selectTags = createSelector(selectMeta, (m) => m.tags);
export const selectSportType = createSelector(selectMeta, (m) => m.sportType);
export const selectLengthType = createSelector(selectMeta, (m) => m.lengthType);

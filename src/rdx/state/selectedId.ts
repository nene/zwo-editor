import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const slice = createSlice({
  name: 'selectedId',
  initialState: null as string | null,
  reducers: {
    setSelectedId: (state, {payload}: PayloadAction<string>) => payload,
    clearSelection: () => null,
  },
});

export const reducer = slice.reducer;
export const { setSelectedId, clearSelection } = slice.actions;

export const selectSelectedId = (state: RootState) => state.selectedId || undefined;

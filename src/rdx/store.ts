import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducer as workout } from './workout';

const rootReducer = combineReducers({
  workout,
})

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

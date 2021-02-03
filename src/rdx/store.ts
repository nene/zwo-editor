import { configureStore } from '@reduxjs/toolkit';
import { reducer as workoutReducer } from './workout';
import { reducer as athleteReducer } from './athlete';
import { reducer as intervalsReducer } from './intervals';
import { reducer as instructionsReducer } from './instructions';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = persistCombineReducers({
  key: 'root',
  storage,
}, {
  workout: workoutReducer,
  athlete: athleteReducer,
  intervals: intervalsReducer,
  instructions: instructionsReducer,
}); 

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

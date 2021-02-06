import { configureStore } from '@reduxjs/toolkit';
import { reducer as metaReducer } from './state/meta';
import { reducer as athleteReducer } from './state/athlete';
import { reducer as intervalsReducer } from './state/intervals';
import { reducer as instructionsReducer } from './state/instructions';
import { reducer as selectedIdReducer } from './state/selectedId';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = persistCombineReducers({
  key: 'root',
  storage,
}, {
  meta: metaReducer,
  athlete: athleteReducer,
  intervals: intervalsReducer,
  instructions: instructionsReducer,
  selectedId: selectedIdReducer,
}); 

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

import { configureStore } from '@reduxjs/toolkit';
import { reducer as metaReducer } from './meta';
import { reducer as athleteReducer } from './athlete';
import { reducer as intervalsReducer } from './intervals';
import { reducer as instructionsReducer } from './instructions';
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
}); 

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

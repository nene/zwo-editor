import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducer as workoutReducer } from './workout';
import { reducer as athleteReducer } from './athlete';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  workout: persistReducer({
    key: 'workout',
    storage,
  }, workoutReducer),
  athlete: persistReducer({
    key: 'athlete',
    storage,
  }, athleteReducer),
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

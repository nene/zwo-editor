import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducer as workout } from './workout';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  workout: persistReducer({
    key: 'workout',
    storage,
  }, workout),
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

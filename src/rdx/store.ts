import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducer as workout } from './workout';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  workout,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer({
  key: 'workout',
  storage,
}, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor =  persistStore(store);

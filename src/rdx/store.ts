import { configureStore } from '@reduxjs/toolkit';
import { reducer  } from './reducer';
import { persistStore } from 'redux-persist';

export type RootState = ReturnType<typeof reducer>;

export const store = configureStore({
  reducer,
});

export const persistor = persistStore(store);

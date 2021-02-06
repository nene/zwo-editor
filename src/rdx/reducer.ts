import { reducer as meta } from './state/meta';
import { reducer as athlete } from './state/athlete';
import { reducer as intervals } from './state/intervals';
import { reducer as instructions } from './state/instructions';
import { reducer as selectedId } from './state/selectedId';
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const reducer = persistCombineReducers({
  key: 'root',
  storage,
}, {
  meta,
  athlete,
  intervals,
  instructions,
  selectedId,
}); 

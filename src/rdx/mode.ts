import { createSelector } from '@reduxjs/toolkit';
import createMode from '../modes/createMode';
import { selectFtp, selectRunningTimes, selectWeight } from './athlete';
import { selectLengthType, selectSportType } from './workout';

export const selectMode = createSelector(
  selectSportType, selectFtp, selectWeight, selectRunningTimes, selectLengthType,
  (sportType, ftp, weight, runningTimes, lengthType) => {
    return createMode({sportType, ftp, weight, runningTimes, lengthType})
  }
);

import { createAction } from '@reduxjs/toolkit';
import { Workout } from '../types/Workout';

export const clearWorkout = createAction('workout/clearWorkout');
export const loadWorkout = createAction<Workout>('workout/loadWorkout');

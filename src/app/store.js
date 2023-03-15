import { configureStore } from '@reduxjs/toolkit';
import safeBoxReducer from './redux/safeBoxSlice';
import thunk from 'redux-thunk'

export const store = configureStore({
  reducer: {
    depositBox: safeBoxReducer
  },
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
});

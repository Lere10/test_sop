import { configureStore } from '@reduxjs/toolkit';
import despesaReducer from '../features/despesa/despesaSlice';

export const store = configureStore({
  reducer: {
    despesa: despesaReducer,
  },
});

// Tipos úteis
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

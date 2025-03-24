import { configureStore } from '@reduxjs/toolkit'
import despesaReducer from '../features/despesa/despesaSlice'
import empenhoReducer from '../features/empenho/empenhoSlice'

export const store = configureStore({
  reducer: {
    despesa: despesaReducer,
    empenho: empenhoReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

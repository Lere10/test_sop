import { configureStore } from '@reduxjs/toolkit'
import despesaReducer from '../features/despesa/despesaSlice'
import empenhoReducer from '../features/empenho/empenhoSlice'
import pagamentoReducer from '../features/pagamento/pagamentoSlice'

export const store = configureStore({
  reducer: {
    despesa: despesaReducer,
    empenho: empenhoReducer,
    pagamento: pagamentoReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Despesa {
  protocolo: string
  competencia: string
  credor: string
  valorDespesa: number
  descricao: string
  tipoDespesa: string
  status: string
  dataProtocolo: string
  dataVencimento: string
}

interface DespesaState {
  despesas: Despesa[]
}

const initialState: DespesaState = {
  despesas: [],
}

const despesaSlice = createSlice({
  name: 'despesa',
  initialState,
  reducers: {
    setDespesas(state, action: PayloadAction<Despesa[]>) {
      state.despesas = action.payload
    },
    addDespesa(state, action: PayloadAction<Despesa>) {
      state.despesas.push(action.payload)
    },
    removeDespesa(state, action: PayloadAction<string>) {
      state.despesas = state.despesas.filter(
        (despesa) => despesa.protocolo !== action.payload
      )
    },
  },
})

export const { setDespesas, addDespesa, removeDespesa } = despesaSlice.actions
export default despesaSlice.reducer

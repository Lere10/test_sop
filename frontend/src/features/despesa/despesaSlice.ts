
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Tipo para a Despesa
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

// Estado inicial do slice
interface DespesaState {
  despesas: Despesa[]
}

const initialState: DespesaState = {
  despesas: [],
}

// Criando o slice
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

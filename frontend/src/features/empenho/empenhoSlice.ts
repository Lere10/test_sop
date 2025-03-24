import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Empenho {
  numeroEmpenho: string
  dataEmpenho: string
  valorEmpenho: number
  observacao: string
  protocoloDespesa: string
}

interface EmpenhoState {
  lista: Empenho[]
}

const initialState: EmpenhoState = {
  lista: [],
}

const empenhoSlice = createSlice({
  name: 'empenho',
  initialState,
  reducers: {
    setEmpenhos(state, action: PayloadAction<Empenho[]>) {
      state.lista = action.payload
    },
    addEmpenho(state, action: PayloadAction<Empenho>) {
      state.lista.push(action.payload)
    },
    removeEmpenho(state, action: PayloadAction<string>) {
      state.lista = state.lista.filter(
        empenho => empenho.numeroEmpenho !== action.payload
      )
    },
  },
})

export const { setEmpenhos, addEmpenho, removeEmpenho } = empenhoSlice.actions
export default empenhoSlice.reducer

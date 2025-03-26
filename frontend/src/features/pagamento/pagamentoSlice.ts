import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Pagamento {
  numeroPagamento: string
  dataPagamento: string
  valorPagamento: number
  observacao: string
  numeroEmpenho: string
}

interface PagamentoState {
  lista: Pagamento[]
}

const initialState: PagamentoState = {
  lista: [],
}

const pagamentoSlice = createSlice({
  name: 'pagamento',
  initialState,
  reducers: {
    setPagamentos(state, action: PayloadAction<Pagamento[]>) {
      state.lista = action.payload
    },
    addPagamento(state, action: PayloadAction<Pagamento>) {
      state.lista.push(action.payload)
    },
    removePagamento(state, action: PayloadAction<string>) {
      state.lista = state.lista.filter(
        pagamento => pagamento.numeroPagamento !== action.payload
      )
    },
  },
})

export const { setPagamentos, addPagamento, removePagamento } = pagamentoSlice.actions
export default pagamentoSlice.reducer

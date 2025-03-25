import axios from 'axios'

const API_BASE = 'http://localhost:8080/api/pagamentos'

export const getPagamentosPorEmpenho = async (numeroEmpenho: string) => {
  const res = await axios.get(`${API_BASE}?numeroEmpenho=${numeroEmpenho}`)
  return res.data
}

export const getPagamentoById = async (numeroPagamento: string) => {
    const res = await axios.get(`${API_BASE}/${numeroPagamento}`)
    return res.data
  }

export const criarPagamento = async (data: any) => {
  const res = await axios.post(API_BASE, data)
  return res.data
}

export const deletarPagamento = async (numeroPagamento: string) => {
  const res = await axios.delete(`${API_BASE}/${numeroPagamento}`)
  return res.data
}

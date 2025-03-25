import axios from 'axios'

const API_BASE = 'http://localhost:8080/api/despesas'

export const getDespesas = async () => {
  const res = await axios.get(API_BASE)
  return res.data
}

export const getDespesaById = async (protocolo: string) => {
    const res = await axios.get(`${API_BASE}/${protocolo}`)
    return res.data
  }

export const criarDespesa = async (data: any) => {
  const res = await axios.post(API_BASE, data)
  return res.data
}

export const deletarDespesa = async (protocolo: string) => {
  const res = await axios.delete(`${API_BASE}/${protocolo}`)
  return res.data
}

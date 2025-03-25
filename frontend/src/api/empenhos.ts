import axios from 'axios'

const API_BASE = 'http://localhost:8080/api/empenhos'

export const getEmpenhos = async () => {
  const res = await axios.get(API_BASE)
  return res.data
}

export const getEmpenhosById = async (numeroEmpenho: string) => {
    const res = await axios.get(`${API_BASE}/${numeroEmpenho}`)
    return res.data
  }

export const criarEmpenho = async (data: any) => {
  const res = await axios.post(API_BASE, data)
  return res.data
}

export const deletarEmpenho = async (numeroEmpenho: string) => {
  const res = await axios.delete(`${API_BASE}/${numeroEmpenho}`)
  return res.data
}

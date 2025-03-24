'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/store'
import { addDespesa } from '@/features/despesa/despesaSlice'
import Modal from '@/components/Modal'

// Função para formatar moeda
const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function HomePage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const despesas = useSelector((state: RootState) => state.despesa.despesas)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [valor, setValor] = useState('R$ 0,00')
  const [formData, setFormData] = useState({
    competencia: '',
    credor: '',
    valorDespesa: 0,
    descricao: '',
    tipoDespesa: '',
    dataVencimento: '',
  })

  const preencherCamposIniciais = () => {
    const now = new Date()
    const competencia = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return {
      competencia,
      dataProtocolo: now.toISOString(),
      protocolo: crypto.randomUUID(),
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const centavos = (Number(raw) / 100).toFixed(2)
    const formatado = `R$ ${centavos.replace('.', ',')}`
    setValor(formatado)
    setFormData(prev => ({ ...prev, valorDespesa: parseFloat(centavos) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.valorDespesa <= 0) {
      alert('O valor da despesa deve ser maior que zero.')
      return
    }

    const valoresAuto = preencherCamposIniciais()
    dispatch(addDespesa({
      ...formData,
      protocolo: valoresAuto.protocolo,
      competencia: valoresAuto.competencia,
      dataProtocolo: valoresAuto.dataProtocolo,
      status: 'Pendente',
    }))
    setIsModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      competencia: '',
      credor: '',
      valorDespesa: 0,
      descricao: '',
      tipoDespesa: '',
      dataVencimento: '',
    })
    setValor('R$ 0,00')
  }
  const formatarData = (isoDate: string) => {
    const [ano, mes, dia] = isoDate.split('-')
    return `${dia}/${mes}/${ano}`
  }
  

  const handleAbrirEmpenhos = (protocolo: string) => {
    router.push(`/empenhos?protocolo=${protocolo}`)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Controle de Despesas</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Nova Despesa
      </button>

      <ul className="space-y-2">
        {despesas.map((d, i) => (
            <li
            key={i}
            className="border p-3 rounded bg-white shadow-sm hover:bg-gray-100 cursor-pointer"
            onClick={() => handleAbrirEmpenhos(d.protocolo)}
            >
            <strong>{d.descricao}</strong><br/><strong>Credor:</strong> {d.credor} - <strong>{d.tipoDespesa}</strong> - <strong>Valor:</strong> {formatCurrency(d.valorDespesa)} / <strong>Vencimento em:</strong> {formatarData(d.dataVencimento)} / <strong>Protocolo:</strong> {d.protocolo} 
            </li>
        ))}
      </ul>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm() }}>
        <h2 className="text-lg font-semibold mb-4">Cadastrar Nova Despesa</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input name="credor" placeholder="Credor" value={formData.credor} onChange={handleChange} className="border p-2" required />
          <input name="valorDespesa" placeholder="Valor da Despesa" value={valor} onChange={handleValorChange} className="border p-2" required />
          <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} className="border p-2" required />
          <select name="tipoDespesa" value={formData.tipoDespesa} onChange={handleChange} className="border p-2" required>
            <option value="">Selecione o Tipo de Despesa</option>
            <option value="Obra de Edificação">Obra de Edificação</option>
            <option value="Obra de Rodovias">Obra de Rodovias</option>
            <option value="Outros">Outros</option>
          </select>
            <label className="block font-bold">
            Data de vencimento
            </label>
          <input name="dataVencimento" type="date" value={formData.dataVencimento} onChange={handleChange} className="border p-2" required />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
        </form>
      </Modal>
    </div>
  )
}

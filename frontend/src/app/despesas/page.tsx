'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { addDespesa } from '@/features/despesa/despesaSlice'

function getCompetenciaAtual(): string {
  const now = new Date()
  const mes = (now.getMonth() + 1).toString().padStart(2, '0')
  const ano = now.getFullYear()
  return `${ano}-${mes}`
}

export default function CadastroDespesa() {
  const dispatch = useDispatch()
  const despesas = useSelector((state: RootState) => state.despesa.despesas)

  const [formData, setFormData] = useState({
    competencia: getCompetenciaAtual(),
    credor: '',
    valorDespesa: 'R$ 0,00',
    descricao: '',
    tipoDespesa: '',
    dataVencimento: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'valorDespesa') {
      const onlyDigits = value.replace(/\D/g, '')
      const number = parseFloat(onlyDigits) / 100
      const formatted = number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      setFormData(prev => ({ ...prev, valorDespesa: formatted }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const valorNumerico = Number(
      formData.valorDespesa.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
    )

    if (valorNumerico === 0) {
        alert('O valor da despesa não pode ser R$ 0,00.')
        return
      }

    const now = new Date().toISOString() // Para dataProtocolo

    dispatch(addDespesa({
      protocolo: '', // será gerado no backend
      competencia: formData.competencia,
      credor: formData.credor,
      valorDespesa: valorNumerico,
      descricao: formData.descricao,
      tipoDespesa: formData.tipoDespesa,
      status: 'Pendente',
      dataProtocolo: now,
      dataVencimento: formData.dataVencimento
    }))

    setFormData({
      competencia: getCompetenciaAtual(),
      credor: '',
      valorDespesa: 'R$ 0,00',
      descricao: '',
      tipoDespesa: '',
      dataVencimento: ''
    })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Cadastro de Despesa</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input name="credor" placeholder="Credor" value={formData.credor} onChange={handleChange} className="border p-2" required />
        <input name="valorDespesa" placeholder="Valor (R$)" value={formData.valorDespesa} onChange={handleChange} className="border p-2" required />
        <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} className="border p-2" required />
        <select name="tipoDespesa" value={formData.tipoDespesa} onChange={handleChange} className="border p-2" required>
          <option value="">Selecione o Tipo de Despesa</option>
          <option value="Obra de Edificação">Obra de Edificação</option>
          <option value="Obra de Rodovias">Obra de Rodovias</option>
          <option value="Outros">Outros</option>
        </select>
        <label htmlFor="dataVencimento" className="font-semibold">Data de Vencimento</label>
        
        <input name="dataVencimento" type="date" value={formData.dataVencimento} onChange={handleChange} className="border p-2" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
      </form>

      <h2 className="text-lg font-semibold mt-8">Despesas Cadastradas</h2>
      <ul className="mt-4 space-y-2">
        {despesas.map((d, i) => (
          <li key={i} className="border p-2 rounded">
            <strong>{d.credor}</strong> - {d.tipoDespesa} - {d.competencia} - R$ {d.valorDespesa}
          </li>
        ))}
      </ul>
    </div>
  )
}

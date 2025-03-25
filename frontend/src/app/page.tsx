'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/store'
import { addDespesa, removeDespesa, setDespesas } from '@/features/despesa/despesaSlice'
import { setEmpenhos } from '@/features/empenho/empenhoSlice'
import Modal from '@/components/Modal'
import trashIcon from '../../public/icons/trash.png'
import { getDespesas, criarDespesa, deletarDespesa } from '@/api/despesas'
import { getEmpenhos } from '@/api/empenhos'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function HomePage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const despesas = useSelector((state: RootState) => state.despesa.despesas)
  const empenhos = useSelector((state: RootState) => state.empenho.lista)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [despesaSelecionada, setDespesaSelecionada] = useState<string | null>(null)
  const [temEmpenhos, setTemEmpenhos] = useState(false)
  const [loadingNavegacao, setLoadingNavegacao] = useState(false)

  const [valor, setValor] = useState('R$ 0,00')
  const [formData, setFormData] = useState({
    competencia: '',
    credor: '',
    valorDespesa: 0,
    descricao: '',
    tipoDespesa: '',
    dataVencimento: '',
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [despesasData, empenhosData] = await Promise.all([
          getDespesas(),
          getEmpenhos()
        ])
        dispatch(setDespesas(despesasData))
        dispatch(setEmpenhos(empenhosData))
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error)
      }
    }
    fetchData()
  }, [dispatch])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.valorDespesa <= 0) {
      alert('O valor da despesa deve ser maior que zero.')
      return
    }

    const valoresAuto = preencherCamposIniciais()
    const payload = {
      ...formData,
      protocolo: valoresAuto.protocolo,
      competencia: valoresAuto.competencia,
      dataProtocolo: valoresAuto.dataProtocolo,
      status: 'Pendente',
    }

    try {
      await criarDespesa(payload)
      dispatch(addDespesa(payload))
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      alert('Erro ao salvar a despesa.')
    }
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
    setLoadingNavegacao(true)
    router.push(`/empenhos?protocolo=${protocolo}`)
  }

  const confirmarExclusao = (protocolo: string) => {
    const possuiEmpenhos = empenhos.some((e) => e.protocoloDespesa === protocolo)
    setTemEmpenhos(possuiEmpenhos)
    setDespesaSelecionada(protocolo)
    setModalDeleteOpen(true)
  }

  const excluirDespesa = async () => {
    if (despesaSelecionada && !temEmpenhos) {
      try {
        await deletarDespesa(despesaSelecionada)
        dispatch(removeDespesa(despesaSelecionada))
      } catch (error) {
        alert('Erro ao excluir a despesa.')
      }
    }
    setModalDeleteOpen(false)
    setDespesaSelecionada(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Controle de Despesas</h1>

      {loadingNavegacao && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-xl font-bold animate-pulse">Carregando...</div>
        </div>
      )}

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
            className="border p-3 rounded bg-white shadow-sm hover:bg-gray-100 cursor-pointer flex justify-between items-center"
          >
            <div onClick={() => handleAbrirEmpenhos(d.protocolo)} className="flex-1">
              <strong>{d.descricao}</strong><br />
              <strong>Credor:</strong> {d.credor} - <strong>{d.tipoDespesa}</strong> - <strong>Valor:</strong> {formatCurrency(d.valorDespesa)} / <strong>Vencimento:</strong> {formatarData(d.dataVencimento)} / <strong>Protocolo:</strong> {d.protocolo}
            </div>
            <button
              onClick={() => confirmarExclusao(d.protocolo)}
              className="ml-4"
              title="Excluir"
            >
              <img src={trashIcon.src} alt="Excluir" className="w-5 h-5" />
            </button>
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
          <label className="block font-bold">Data de vencimento</label>
          <input name="dataVencimento" type="date" value={formData.dataVencimento} onChange={handleChange} className="border p-2" required />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
        </form>
      </Modal>

      <Modal isOpen={modalDeleteOpen} onClose={() => setModalDeleteOpen(false)}>
        {temEmpenhos ? (
          <div className="text-center">
            <p className="mb-4">Não é possível excluir uma despesa que possua empenhos.</p>
            <button
              onClick={() => setModalDeleteOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Entendi
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Tem certeza que deseja excluir essa despesa?</p>
            <div className="flex justify-center gap-4">
              <button onClick={excluirDespesa} className="bg-red-600 text-white px-4 py-2 rounded">
                Sim
              </button>
              <button onClick={() => setModalDeleteOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                Não
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

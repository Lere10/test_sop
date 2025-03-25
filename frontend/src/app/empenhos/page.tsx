'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { addEmpenho, removeEmpenho } from '@/features/empenho/empenhoSlice'
import Modal from '@/components/Modal'
import { v4 as uuidv4 } from 'uuid'
import trashIcon from '../../../public/icons/trash.png'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatDate = (iso: string) => {
  const data = new Date(iso)
  return data.toLocaleDateString('pt-BR')
}

const formatDateTime = (iso: string) => {
  const data = new Date(iso)
  return data.toLocaleString('pt-BR')
}

export default function EmpenhosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const protocolo = searchParams.get('protocolo') || ''

  const dispatch = useDispatch()

  const empenhos = useSelector((state: RootState) =>
    state.empenho.lista.filter((e) => e.protocoloDespesa === protocolo)
  )

  const pagamentos = useSelector((state: RootState) => state.pagamento.lista)

  const despesa = useSelector((state: RootState) =>
    state.despesa.despesas.find((d) => d.protocolo === protocolo)
  )

  const valorTotalEmpenhado = empenhos.reduce((soma, e) => soma + e.valorEmpenho, 0)
  const valorRestante = (despesa?.valorDespesa || 0) - valorTotalEmpenhado

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [empenhoSelecionado, setEmpenhoSelecionado] = useState<string | null>(null)
  const [temPagamentos, setTemPagamentos] = useState(false)

  const [formData, setFormData] = useState({
    valorEmpenho: 0,
    observacao: '',
  })
  const [valor, setValor] = useState('R$ 0,00')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const centavos = (Number(raw) / 100).toFixed(2)
    const formatado = `R$ ${centavos.replace('.', ',')}`
    setValor(formatado)
    setFormData((prev) => ({ ...prev, valorEmpenho: parseFloat(centavos) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.valorEmpenho <= 0) {
      alert('O valor do empenho deve ser maior que zero.')
      return
    }

    if (formData.valorEmpenho > valorRestante) {
      alert(`O valor restante da despesa é ${formatCurrency(valorRestante)}.`)
      return
    }

    dispatch(
      addEmpenho({
        numeroEmpenho: uuidv4(),
        dataEmpenho: new Date().toISOString(),
        ...formData,
        protocoloDespesa: protocolo,
      })
    )

    setIsModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      valorEmpenho: 0,
      observacao: '',
    })
    setValor('R$ 0,00')
  }

  const confirmarExclusao = (numeroEmpenho: string) => {
    const possuiPagamentos = pagamentos.some((p) => p.numeroEmpenho === numeroEmpenho)
    setTemPagamentos(possuiPagamentos)
    setEmpenhoSelecionado(numeroEmpenho)
    setModalDeleteOpen(true)
  }

  const excluirEmpenho = () => {
    if (empenhoSelecionado && !temPagamentos) {
      dispatch(removeEmpenho(empenhoSelecionado))
    }
    setModalDeleteOpen(false)
    setEmpenhoSelecionado(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.push('/')}
        className="text-blue-600 underline mb-4"
      >
        ← Voltar para Despesas
      </button>

      <h1 className="text-2xl font-bold mb-2">
        Empenhos da Despesa <span className="text-blue-600">{protocolo}</span>
      </h1>

      {despesa && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <p><strong>Credor:</strong> {despesa.credor}</p>
          <p><strong>Valor da Despesa:</strong> {formatCurrency(despesa.valorDespesa)}</p>
          <p><strong>Valor Total Empenhado:</strong> {formatCurrency(valorTotalEmpenhado)}</p>
          <p>
            <strong>Valor Restante:</strong>{' '}
            <span className={valorRestante > 0 ? 'text-green-600' : 'text-red-600 font-bold'}>
              {formatCurrency(valorRestante)}
            </span>
          </p>
          <p><strong>Data do Protocolo:</strong> {formatDateTime(despesa.dataProtocolo)}</p>
          <p><strong>Data de Vencimento:</strong> {formatDate(despesa.dataVencimento)}</p>
          <p><strong>Tipo:</strong> {despesa.tipoDespesa}</p>
          <p><strong>Descrição:</strong> {despesa.descricao}</p>
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Novo Empenho
      </button>

      <ul className="space-y-2">
        {empenhos.length === 0 ? (
          <li className="text-gray-500 italic">Nenhum empenho cadastrado ainda.</li>
        ) : (
          empenhos.map((e, i) => (
            <li
              key={i}
              className="border p-3 rounded bg-white shadow-sm flex justify-between items-center"
            >
              <div
                onClick={() => router.push(`/pagamentos?numeroEmpenho=${e.numeroEmpenho}`)}
                className="cursor-pointer flex-1"
                title="Ver pagamentos"
              >
                <strong>Protocolo de empenho: {e.numeroEmpenho}</strong> - {formatCurrency(e.valorEmpenho)} - {e.observacao} - Empenhado em {formatDate(e.dataEmpenho)}
              </div>
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  confirmarExclusao(e.numeroEmpenho)
                }}
                className="ml-4"
                title="Excluir"
              >
                <img src={trashIcon.src} alt="Excluir" className="w-5 h-5" />
              </button>
            </li>
          ))
        )}
      </ul>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm() }}>
        <h2 className="text-lg font-semibold mb-4">Cadastrar Novo Empenho</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <label className="font-bold">Valor do Empenho</label>
          <input
            type="text"
            name="valorEmpenho"
            value={valor}
            onChange={handleValorChange}
            className="border p-2"
            required
          />

          <label className="font-bold">Observação</label>
          <textarea
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            className="border p-2"
            required
          />

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Salvar Empenho
          </button>
        </form>
      </Modal>

      <Modal isOpen={modalDeleteOpen} onClose={() => setModalDeleteOpen(false)}>
        {temPagamentos ? (
          <div className="text-center">
            <p className="mb-4">Não é possível excluir um empenho com um pagamento registrado.</p>
            <button
              onClick={() => setModalDeleteOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Entendi
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Tem certeza que deseja excluir esse empenho?</p>
            <div className="flex justify-center gap-4">
              <button onClick={excluirEmpenho} className="bg-red-600 text-white px-4 py-2 rounded">
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

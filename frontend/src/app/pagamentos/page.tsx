'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { addPagamento, removePagamento } from '@/features/pagamento/pagamentoSlice'
import Modal from '@/components/Modal'
import { v4 as uuidv4 } from 'uuid'
import trashIcon from '../../../public/icons/trash.png'

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatDateTime = (iso: string) => {
  const data = new Date(iso)
  return data.toLocaleString('pt-BR')
}

export default function PagamentosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const numeroEmpenho = searchParams.get('numeroEmpenho') || ''
  const dispatch = useDispatch()

  const pagamentos = useSelector((state: RootState) =>
    state.pagamento.lista.filter((p) => p.numeroEmpenho === numeroEmpenho)
  )

  const empenho = useSelector((state: RootState) =>
    state.empenho.lista.find((e) => e.numeroEmpenho === numeroEmpenho)
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ valorPagamento: 0, observacao: '' })
  const [valor, setValor] = useState('R$ 0,00')
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const centavos = (Number(raw) / 100).toFixed(2)
    const formatado = `R$ ${centavos.replace('.', ',')}`
    setValor(formatado)
    setFormData((prev) => ({ ...prev, valorPagamento: parseFloat(centavos) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.valorPagamento <= 0) {
      alert('O valor do pagamento deve ser maior que zero.')
      return
    }

    const totalPagamentos = pagamentos.reduce((sum, p) => sum + p.valorPagamento, 0)
    const novoTotal = totalPagamentos + formData.valorPagamento

    if (empenho && novoTotal > empenho.valorEmpenho) {
      alert(`A soma dos pagamentos (${formatCurrency(novoTotal)}) ultrapassa o valor do empenho (${formatCurrency(empenho.valorEmpenho)}).`)
      return
    }

    dispatch(
      addPagamento({
        numeroPagamento: uuidv4(),
        dataPagamento: new Date().toISOString(),
        ...formData,
        numeroEmpenho,
      })
    )

    setIsModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({ valorPagamento: 0, observacao: '' })
    setValor('R$ 0,00')
  }

  const confirmarExclusao = (numeroPagamento: string) => {
    setPagamentoSelecionado(numeroPagamento)
    setModalDeleteOpen(true)
  }

  const excluirPagamento = () => {
    if (pagamentoSelecionado) {
      dispatch(removePagamento(pagamentoSelecionado))
    }
    setModalDeleteOpen(false)
    setPagamentoSelecionado(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="text-blue-600 underline mb-4">
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold mb-2">
        Pagamentos do Empenho <span className="text-blue-600">{numeroEmpenho}</span>
      </h1>

      {empenho && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <p><strong>Valor do Empenho:</strong> {formatCurrency(empenho.valorEmpenho)}</p>
          <p><strong>Data do Empenho:</strong> {formatDateTime(empenho.dataEmpenho)}</p>
          <p><strong>Observação:</strong> {empenho.observacao}</p>
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Novo Pagamento
      </button>

      <ul className="space-y-2">
        {pagamentos.length === 0 ? (
          <li className="text-gray-500 italic">Nenhum pagamento cadastrado ainda.</li>
        ) : (
          pagamentos.map((p, i) => (
            <li key={i} className="border p-3 rounded bg-white shadow-sm flex justify-between items-center">
              <div>
                <strong>{p.numeroPagamento}</strong> - {formatCurrency(p.valorPagamento)} - {p.observacao} em {formatDateTime(p.dataPagamento)}
              </div>
              <button
                onClick={() => confirmarExclusao(p.numeroPagamento)}
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
        <h2 className="text-lg font-semibold mb-4">Cadastrar Novo Pagamento</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <label className="font-bold">Valor do Pagamento</label>
          <input
            type="text"
            name="valorPagamento"
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
            Salvar Pagamento
          </button>
        </form>
      </Modal>

      <Modal isOpen={modalDeleteOpen} onClose={() => setModalDeleteOpen(false)}>
        <div className="text-center">
          <p className="mb-4">Tem certeza que deseja excluir o pagamento?</p>
          <div className="flex justify-center gap-4">
            <button onClick={excluirPagamento} className="bg-red-600 text-white px-4 py-2 rounded">
              Sim
            </button>
            <button onClick={() => setModalDeleteOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
              Não
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

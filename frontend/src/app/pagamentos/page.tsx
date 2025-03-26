'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { addEmpenho } from '@/features/empenho/empenhoSlice'
import { addDespesa } from '@/features/despesa/despesaSlice'
import Modal from '@/components/Modal'
import trashIcon from '../../../public/icons/trash.png'
import { getPagamentosPorEmpenho, criarPagamento, deletarPagamento } from '@/api/pagamentos'
import { getEmpenhosById } from '@/api/empenhos'
import { getDespesaById } from '@/api/despesas'
import { setPagamentos, addPagamento, removePagamento } from '@/features/pagamento/pagamentoSlice'

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

  const empenho = useSelector((state: RootState) =>
    state.empenho.lista.find((e) => e.numeroEmpenho === numeroEmpenho)
  )

  const despesa = useSelector((state: RootState) =>
    state.despesa.despesas.find((d) => d.protocolo === empenho?.protocoloDespesa)
  )

  const pagamentosGlobais = useSelector((state: RootState) => state.pagamento.lista)
  const pagamentos = pagamentosGlobais.filter(p => p.numeroEmpenho === numeroEmpenho)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ valorPagamento: 0, observacao: '' })
  const [valor, setValor] = useState('R$ 0,00')
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const data = await getPagamentosPorEmpenho(numeroEmpenho)
        dispatch(setPagamentos(data))
      } catch (error) {
        alert('Erro ao carregar pagamentos.')
      }
    }
    if (numeroEmpenho) fetchPagamentos()
  }, [numeroEmpenho, dispatch])

  useEffect(() => {
    const fetchEmpenhoIfMissing = async () => {
      if (!empenho && numeroEmpenho) {
        try {
          const data = await getEmpenhosById(numeroEmpenho)
          dispatch(addEmpenho(data))
        } catch (error) {
          console.error('Erro ao buscar empenho:', error)
        }
      }
    }
    fetchEmpenhoIfMissing()
  }, [empenho, numeroEmpenho, dispatch])

  useEffect(() => {
    const fetchDespesaIfMissing = async () => {
      if (!despesa && empenho?.protocoloDespesa) {
        try {
          const data = await getDespesaById(empenho.protocoloDespesa)
          dispatch(addDespesa(data))
        } catch (error) {
          console.error('Erro ao buscar despesa:', error)
        }
      }
    }
    fetchDespesaIfMissing()
  }, [despesa, empenho, dispatch])

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (!empenho?.numeroEmpenho) {
      alert('Número do empenho não encontrado.')
      return
    }

    const payload = {
      ...formData,
      dataPagamento: new Date().toISOString(),
      numeroEmpenho: empenho.numeroEmpenho,
    }

    try {
      const novoPagamento = await criarPagamento(payload)
      dispatch(addPagamento(novoPagamento))
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.log('Erro ao salvar pagamento:', error)
      alert('Erro ao salvar o pagamento.')
    }
  }

  const resetForm = () => {
    setFormData({ valorPagamento: 0, observacao: '' })
    setValor('R$ 0,00')
  }

  const confirmarExclusao = (numeroPagamento: string) => {
    setPagamentoSelecionado(numeroPagamento)
    setModalDeleteOpen(true)
  }

  const excluirPagamento = async () => {
    if (pagamentoSelecionado) {
      try {
        await deletarPagamento(pagamentoSelecionado)
        dispatch(removePagamento(pagamentoSelecionado))
      } catch (error) {
        alert('Erro ao excluir pagamento.')
      }
    }
    setModalDeleteOpen(false)
    setPagamentoSelecionado(null)
  }

  const handleVoltar = () => {
    setLoading(true)
    router.back()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-xl font-bold animate-pulse">Carregando...</div>
        </div>
      )}

      <button onClick={handleVoltar} className="text-blue-600 underline mb-4">
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold mb-2">Pagamentos do Empenho</h1>
      <p className="text-blue-600 max-w-xs break-words pb-7 pt-0">{numeroEmpenho}</p>

      {empenho && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <p><strong>Valor do Empenho:</strong> {formatCurrency(empenho.valorEmpenho)}</p>
          <p><strong>Data do Empenho:</strong> {formatDateTime(empenho.dataEmpenho)}</p>
          <p><strong>Observação:</strong> {empenho.observacao}</p>
        </div>
      )}

      <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded mb-6">
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
        <h2 className="text-lg font-semibold mb-4 text-black">Cadastrar Novo Pagamento</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 ">
          <label className="font-bold text-black">Valor do Pagamento</label>
          <input
            type="text"
            name="valorPagamento"
            value={valor}
            onChange={handleValorChange}
            className="border p-2 text-black"
            required
          />

          <label className="font-bold text-black">Observação</label>
          <textarea
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            className="border p-2 text-black"
            required
          />

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Salvar Pagamento
          </button>
        </form>
      </Modal>

      <Modal isOpen={modalDeleteOpen} onClose={() => setModalDeleteOpen(false)}>
        <div className="text-center">
          <p className="mb-4 text-black">Tem certeza que deseja excluir o pagamento?</p>
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

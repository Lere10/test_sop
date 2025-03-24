import './globals.css'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store'
import type { Metadata } from 'next'
import ReduxProvider from '../store/provider'

export const metadata: Metadata = {
  title: 'SOP Controle Financeiro',
  description: 'Controle de Despesas, Empenhos e Pagamentos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}

# 💸 Controle Financeiro - Frontend

Este projeto é a interface web de um sistema de controle financeiro com foco em **despesas públicas**, **empenhos** e **pagamentos**, desenvolvido com **Next.js**, **Redux Toolkit**, **TypeScript** e **TailwindCSS**.

---

## 📦 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [uuid](https://www.npmjs.com/package/uuid)

---

## 🏗️ Estrutura

```
src/
├── api/                 # Integração com o backend (despesas, empenhos, pagamentos)
├── app/                 # Páginas do Next.js
│   ├── page.tsx         # Página inicial (lista de despesas)
│   └── empenhos/        # Página de empenhos vinculados à despesa
│   └── pagamentos/      # Página de pagamentos vinculados ao empenho
├── components/          # Componentes reutilizáveis (ex: Modal)
├── features/            # Slices do Redux
├── public/              # Ícones e recursos estáticos
└── store/               # Configuração da store do Redux
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório:

```bash
git clone https://github.com/Lere10/test_sop
cd test_sop
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Execute a aplicação:

```bash
npm run dev

```

Acesse no navegador: [http://localhost:3000](http://localhost:3000)

---

## 🔗 Integração com o Backend

A aplicação se comunica com uma API Java (Spring Boot) que deve estar rodando em `http://localhost:8080`.
Para executar, abra outra aba em seu terminal, vá até a pasta do backend e rode `./mvnw spring-boot:run`

### Endpoints utilizados:

- `GET /api/despesas`
- `GET /api/despesas/{protocolo}`
- `POST /api/despesas`
- `DELETE /api/despesas/{protocolo}`
- `GET /api/empenhos`
- `GET /api/empenhos/{numeroEmpenho}`
- `POST /api/empenhos`
- `DELETE /api/empenhos/{numeroEmpenho}`
- `GET /api/pagamentos?numeroEmpenho={id}`
- `GET /api/pagamentos/{numeroPagamento}`
- `POST /api/pagamentos`
- `DELETE /api/pagamentos/{numeroPagamento}`

---

## 📌 Observações

- A aplicação impede a exclusão de despesas com empenhos e empenhos com pagamentos.
- Os valores são exibidos e formatados com base no padrão brasileiro (R$).
- A aplicação utiliza `uuid` para gerar identificadores únicos no frontend antes de enviar ao backend.

---

## 🧑‍💻 Desenvolvido por

- [Lucas Lere](https://github.com/Lere10)

---

## 📄 Licença

Este projeto está licenciado sob a MIT License.

# 💰 SOP - Sistema de Controle Financeiro

Este projeto é um sistema de controle financeiro que gerencia **Despesas**, **Empenhos** e **Pagamentos**.
Foi desenvolvido com **Spring Boot**, **JPA** e **PostgreSQL**.

---

## 🧱 Estrutura da Aplicação

- **Despesa**: Representa processos financeiros da instituição.
- **Empenho**: Compromete recursos financeiros vinculados à despesa.
- **Pagamento**: Efetiva o pagamento de um empenho.

---

## 🚀 Tecnologias Utilizadas

- Java 17
- Spring Boot 3.4.4
- Spring Data JPA
- PostgreSQL
- Maven
- Lombok

---

## ⚙️ Como Executar

### 1. Clone o repositório

```bash
*(SSH)*
git clone git@github.com:Lere10/test_sop.git

*(HTTPS)*
git clone https://github.com/Lere10/test_sop.git

cd test_sop/backend
```

### 2. Configure o `application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/sop_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
```

### 3. Execute a aplicação

````
Primeiro, crie um banco de dados via Postgres e rode o arquivo `schema.sql` que se encontra na raíz do diretório `backend`

Depois, rode:
```bash
./mvnw spring-boot:run
````

API deve ficar disponível em:  
📍 `http://localhost:8080/api`

---

## 🔀 Endpoints Disponíveis

### 🧾 Despesas

- `GET /api/despesas`
- `GET /api/despesas/{protocolo}`
- `POST /api/despesas`
- `DELETE /api/despesas/{protocolo}`

### 📌 Empenhos

- `GET /api/empenhos`
- `GET /api/empenhos/{numero de empenho}`
- `POST /api/empenhos`
- `DELETE /api/empenhos/{numero de empenho}`

### 💸 Pagamentos

- `GET /api/pagamentos`
- `GET /api/pagamentos/{numero de pagamento}`
- `POST /api/pagamentos`
- `DELETE /api/pagamentos/{numero de pagamento}`

---

## 📜 Regras de Negócio

- A soma dos valores dos **empenhos** não pode ultrapassar o valor da **despesa**.
- A soma dos valores dos **pagamentos** não pode ultrapassar o valor do **empenho**.
- Não é permitido excluir uma **despesa** com **empenhos**.
- Não é permitido excluir um **empenho** com **pagamentos**.
- O valor de um **empenho** ou **pagamento** não pode ser **zero**.

---

## 🗃️ Banco de Dados

- Banco: PostgreSQL
- O script `schema.sql` está incluído na raiz do projeto.
- Use o script para criar as tabelas manualmente, se necessário.

---

## 📊 Diagrama ER

O diagrama está em `docs/er_diagram_sop.png`.

> Abra o arquivo para visualizar as relações entre Despesa, Empenho e Pagamento.

---

## 🛠️ Desenvolvido por

- [Lucas Lere](https://github.com/Lere10)
- Projeto da SOP - Controle de Despesas/Empenhos/Pagamentos - Teste técnico

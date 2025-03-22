# Diagrama ER - Controle Financeiro

```mermaid
erDiagram
    DESPESA {
        int id PK
        string protocolo "UN"
        string tipo_despesa
        datetime data_protocolo
        datetime data_vencimento
        string credor
        string descricao
        decimal valor_despesa
        string status "opcional"
    }
    
    EMPENHO {
        int id PK
        string numero_empenho "UN"
        datetime data_empenho
        decimal valor_empenho
        string observacao
        int despesa_id FK
    }
    
    PAGAMENTO {
        int id PK
        string numero_pagamento "UN"
        datetime data_pagamento
        decimal valor_pagamento
        string observacao
        int empenho_id FK
    }
    
    DESPESA ||--o{ EMPENHO : possui
    EMPENHO ||--o{ PAGAMENTO : possui
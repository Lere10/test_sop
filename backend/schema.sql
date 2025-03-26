-- Tabela: despesas
CREATE TABLE despesas (
    protocolo VARCHAR(255) PRIMARY KEY,
    competencia VARCHAR(255) NOT NULL,
    credor VARCHAR(255),
    valor_despesa NUMERIC(15,2),
    descricao VARCHAR(255),
    tipo_despesa VARCHAR(255),
    status VARCHAR(255),
    data_protocolo TIMESTAMP,
    data_vencimento DATE
);

-- Tabela: empenhos
CREATE TABLE empenhos (
    numero_empenho UUID PRIMARY KEY,
    data_empenho TIMESTAMP NOT NULL,
    valor_empenho NUMERIC(15,2) NOT NULL,
    observacao VARCHAR(255),
    protocolo_despesa VARCHAR(255) NOT NULL,
    CONSTRAINT fk_empenho_despesa FOREIGN KEY (protocolo_despesa)
    REFERENCES despesas(protocolo) ON DELETE RESTRICT
);

-- Tabela: pagamentos
CREATE TABLE pagamentos (
    numero_pagamento UUID PRIMARY KEY,
    data_pagamento TIMESTAMP NOT NULL,
    valor_pagamento NUMERIC(15,2) NOT NULL,
    observacao VARCHAR(255),
    numero_empenho UUID NOT NULL,
    CONSTRAINT fk_pagamento_empenho FOREIGN KEY (numero_empenho)
    REFERENCES empenhos(numero_empenho) ON DELETE RESTRICT
);

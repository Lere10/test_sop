package com.lere.sop.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PagamentoDTO {
    private String numeroPagamento;
    private LocalDateTime dataPagamento;
    private BigDecimal valorPagamento;
    private String observacao;
    private String numeroEmpenho; // UUID do empenho ao qual o pagamento está atrelado
}

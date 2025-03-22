package com.lere.sop.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
public class DespesaDTO {
    private String protocolo;
    private String competencia;
    private String credor;
    private BigDecimal valorDespesa;
    private String descricao;
    private String tipoDespesa;
    private String status;
    private LocalDateTime dataProtocolo;
    private LocalDate dataVencimento;
}

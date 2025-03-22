package com.lere.sop.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class EmpenhoDTO {
    private String numeroEmpenho;
    private LocalDateTime dataEmpenho;
    private BigDecimal valorEmpenho;
    private String observacao;
    private String protocoloDespesa;  
}

package com.lere.sop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pagamentos")
@Getter
@Setter
public class Pagamento {

    @Id
    @GeneratedValue(generator = "uuid-pagamento")
    @GenericGenerator(name = "uuid-pagamento", strategy = "uuid2")
    private UUID numeroPagamento;

    @Column(name = "data_pagamento", nullable = false)
    private LocalDateTime dataPagamento;

    @Column(name = "valor_pagamento", nullable = false)
    private BigDecimal valorPagamento;

    @Column(name = "observacao")
    private String observacao;

    @ManyToOne(optional = false)
    @JoinColumn(name = "numero_empenho", referencedColumnName = "numeroEmpenho", nullable = false)
    private Empenho empenho;
}

package com.lere.sop.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import java.util.UUID;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "empenhos")
@Getter
@Setter
public class Empenho {

    @Id
    @GeneratedValue(generator = "uuid-empenho")
    @GenericGenerator(name = "uuid-empenho", strategy = "uuid2")
    private UUID numeroEmpenho;

    @Column(name = "data_empenho", nullable = false)
    private LocalDateTime dataEmpenho;

    @Column(name = "valor_empenho", nullable = false)
    private BigDecimal valorEmpenho;

    @Column(name = "observacao")
    private String observacao;

    @ManyToOne(optional = false)
    @JoinColumn(name = "protocolo_despesa", referencedColumnName = "protocolo", nullable = false)
    private Despesa despesa;
}

package com.lere.sop.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import java.time.LocalDateTime;



import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;


@Entity
@Table(name = "despesas")
@Data
public class Despesa {

    @Id
    @Column(name = "protocolo", nullable = false, unique = true)
    @GeneratedValue(generator = "protocolo-generator")
    @GenericGenerator(name = "protocolo-generator", strategy = "uuid")
    private String protocolo;

    @Column(name = "competencia", nullable = false)
    private String competencia;

    @Column(name = "credor")
    private String credor;

    @Column(name = "valor_despesa")
    private BigDecimal valorDespesa;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "tipo_despesa")
    private String tipoDespesa;

    @Column(name = "status")
    private String status;

    @Column(name = "data_protocolo")
    private LocalDateTime dataProtocolo;

    @Column(name = "data_vencimento")
    private LocalDate dataVencimento;

    @OneToMany(mappedBy = "despesa", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Empenho> empenhos = new ArrayList<>();

}

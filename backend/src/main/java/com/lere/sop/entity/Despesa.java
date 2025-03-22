package com.lere.sop.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "despesas")
public class Despesa {

    //  @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private Long id;

    @Id
    @Column(name = "protocolo", nullable = false, unique = true)
    private String protocolo;

    @Column(name = "tipo_despesa", nullable = false)
    private String tipoDespesa;

    @Column(name = "data_protocolo", nullable = false)
    private LocalDateTime dataProtocolo;

    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @Column(name = "credor", nullable = false)
    private String credor;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "valor_despesa", nullable = false)
    private BigDecimal valorDespesa;

    @Column(name = "status")
    private String status;

    // Getters e Setters

    public String getProtocolo() {
        return protocolo;
    }

    public void setProtocolo(String protocolo) {
        this.protocolo = protocolo;
    }

    public String getTipoDespesa() {
        return tipoDespesa;
    }

    public void setTipoDespesa(String tipoDespesa) {
        this.tipoDespesa = tipoDespesa;
    }

    public LocalDateTime getDataProtocolo() {
        return dataProtocolo;
    }

    public void setDataProtocolo(LocalDateTime dataProtocolo) {
        this.dataProtocolo = dataProtocolo;
    }

    public LocalDate getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDate dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public String getCredor() {
        return credor;
    }

    public void setCredor(String credor) {
        this.credor = credor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValorDespesa() {
        return valorDespesa;
    }

    public void setValorDespesa(BigDecimal valorDespesa) {
        this.valorDespesa = valorDespesa;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

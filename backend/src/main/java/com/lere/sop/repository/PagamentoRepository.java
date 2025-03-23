package com.lere.sop.repository;

import com.lere.sop.entity.Pagamento;
import com.lere.sop.entity.Empenho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PagamentoRepository extends JpaRepository<Pagamento, UUID> {

    // Verifica se há pagamentos para um determinado empenho
    boolean existsByEmpenho(Empenho empenho);

    // Opcional: listar todos os pagamentos de um empenho específico
    List<Pagamento> findByEmpenho(Empenho empenho);
}

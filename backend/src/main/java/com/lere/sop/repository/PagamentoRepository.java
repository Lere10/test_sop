package com.lere.sop.repository;

import com.lere.sop.entity.Pagamento;
import com.lere.sop.entity.Empenho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PagamentoRepository extends JpaRepository<Pagamento, UUID> {

 
    boolean existsByEmpenho(Empenho empenho);

    List<Pagamento> findByEmpenho(Empenho empenho);
}

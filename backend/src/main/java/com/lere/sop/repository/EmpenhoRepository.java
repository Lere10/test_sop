package com.lere.sop.repository;

import java.util.UUID;
import com.lere.sop.entity.Empenho;
import com.lere.sop.entity.Despesa;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpenhoRepository extends JpaRepository<Empenho, UUID> {
    boolean existsByDespesa(Despesa despesa);
}

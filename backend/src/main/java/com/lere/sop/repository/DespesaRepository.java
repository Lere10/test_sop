package com.lere.sop.repository;

import com.lere.sop.entity.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DespesaRepository extends JpaRepository<Despesa, String> {
    Optional<Despesa> findById(String protocolo);
}


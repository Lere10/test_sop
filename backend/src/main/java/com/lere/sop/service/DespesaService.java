package com.lere.sop.service;

import com.lere.sop.dto.DespesaDTO;
import com.lere.sop.entity.Despesa;
import com.lere.sop.repository.DespesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DespesaService {

    @Autowired
    private DespesaRepository despesaRepository;

    public List<Despesa> listarTodas() {
        return despesaRepository.findAll();
    }

    public Optional<Despesa> buscarPorProtocolo(String protocolo) {
        return despesaRepository.findById(protocolo);
    }

    public Despesa salvar(Despesa despesa) {
        return despesaRepository.save(despesa);
    }

    public void deletarPorProtocolo(String protocolo) {
        despesaRepository.deleteById(protocolo);
    }
}

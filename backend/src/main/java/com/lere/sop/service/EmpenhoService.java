package com.lere.sop.service;

import com.lere.sop.dto.EmpenhoDTO;
import com.lere.sop.entity.Despesa;
import com.lere.sop.entity.Empenho;
import com.lere.sop.repository.DespesaRepository;
import com.lere.sop.repository.EmpenhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;


import java.util.List;
import java.util.UUID;

@Service
public class EmpenhoService {

    @Autowired
    private EmpenhoRepository empenhoRepository;

    @Autowired
    private DespesaRepository despesaRepository;

    public Empenho salvar(EmpenhoDTO dto) {
        Despesa despesa = despesaRepository.findById(dto.getProtocoloDespesa())
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada para o protocolo informado."));

        Empenho empenho = new Empenho();
        empenho.setDataEmpenho(dto.getDataEmpenho());
        empenho.setValorEmpenho(dto.getValorEmpenho());
        empenho.setObservacao(dto.getObservacao());
        empenho.setDespesa(despesa);

        return empenhoRepository.save(empenho);
    }

    public List<Empenho> listarTodos() {
        return empenhoRepository.findAll();
    }

    public void deletar(UUID numeroEmpenho) {
        empenhoRepository.deleteById(numeroEmpenho);
    }

public EmpenhoDTO buscarPorId(UUID numeroEmpenho) {
    Empenho empenho = empenhoRepository.findById(numeroEmpenho)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Empenho não encontrado."));

    EmpenhoDTO dto = new EmpenhoDTO();
    dto.setNumeroEmpenho(empenho.getNumeroEmpenho().toString());
    dto.setDataEmpenho(empenho.getDataEmpenho());
    dto.setValorEmpenho(empenho.getValorEmpenho());
    dto.setObservacao(empenho.getObservacao());
    dto.setProtocoloDespesa(empenho.getDespesa().getProtocolo());

    return dto;
}

}

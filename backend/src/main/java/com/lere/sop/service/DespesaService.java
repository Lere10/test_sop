package com.lere.sop.service;

import com.lere.sop.dto.DespesaDTO;
import com.lere.sop.entity.Despesa;
import com.lere.sop.repository.DespesaRepository;
import com.lere.sop.repository.EmpenhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DespesaService {

    @Autowired
    private DespesaRepository despesaRepository;

    @Autowired
    private EmpenhoRepository empenhoRepository;

    public Despesa salvar(Despesa despesa) {
        return despesaRepository.save(despesa);
    }

    public List<Despesa> listarTodas() {
        return despesaRepository.findAll();
    }

   public DespesaDTO buscarPorProtocolo(String protocolo) {
    Despesa despesa = despesaRepository.findById(protocolo)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Despesa não encontrada"));

    DespesaDTO dto = new DespesaDTO();
    dto.setProtocolo(despesa.getProtocolo());
    dto.setCompetencia(despesa.getCompetencia());
    dto.setCredor(despesa.getCredor());
    dto.setValorDespesa(despesa.getValorDespesa());
    dto.setDescricao(despesa.getDescricao());
    dto.setTipoDespesa(despesa.getTipoDespesa());
    dto.setStatus(despesa.getStatus());
    dto.setDataProtocolo(despesa.getDataProtocolo());
    dto.setDataVencimento(despesa.getDataVencimento());

    return dto;
}


    public void deletarPorProtocolo(String protocolo) {
        Despesa despesa = despesaRepository.findById(protocolo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Despesa não encontrada"));

        boolean existeEmpenhos = empenhoRepository.existsByDespesa(despesa);

        if (existeEmpenhos) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Não é possível excluir a despesa pois existem empenhos vinculados.");
        }

        despesaRepository.deleteById(protocolo);
    }
}

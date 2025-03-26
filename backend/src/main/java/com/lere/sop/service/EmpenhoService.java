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
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class EmpenhoService {

    @Autowired
    private EmpenhoRepository empenhoRepository;

    @Autowired
    private DespesaRepository despesaRepository;

    public EmpenhoDTO salvar(EmpenhoDTO dto) {

if (dto.getValorEmpenho() == null || dto.getValorEmpenho().compareTo(BigDecimal.ZERO) <= 0) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O valor do empenho deve ser maior que zero.");
    }

        Despesa despesa = despesaRepository.findById(dto.getProtocoloDespesa())
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada para o protocolo informado."));



        BigDecimal somaEmpenhosExistentes = despesa.getEmpenhos().stream()
                .map(Empenho::getValorEmpenho)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal novoValorTotal = somaEmpenhosExistentes.add(dto.getValorEmpenho());

        if (novoValorTotal.compareTo(despesa.getValorDespesa()) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A soma dos valores dos empenhos ultrapassa o valor total da despesa.");
        }


        Empenho empenho = new Empenho();
        empenho.setDataEmpenho(dto.getDataEmpenho());
        empenho.setValorEmpenho(dto.getValorEmpenho());
        empenho.setObservacao(dto.getObservacao());
        empenho.setDespesa(despesa);

        Empenho salvo = empenhoRepository.save(empenho);
        return toDTO(salvo);
    }

    public List<EmpenhoDTO> listarTodos() {
        return empenhoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public void deletar(UUID numeroEmpenho) {
        empenhoRepository.deleteById(numeroEmpenho);
    }

    public EmpenhoDTO buscarPorId(UUID numeroEmpenho) {
        Empenho empenho = empenhoRepository.findById(numeroEmpenho)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Empenho não encontrado."));
        return toDTO(empenho);
    }

    private EmpenhoDTO toDTO(Empenho empenho) {
        EmpenhoDTO dto = new EmpenhoDTO();
        dto.setNumeroEmpenho(empenho.getNumeroEmpenho().toString());
        dto.setDataEmpenho(empenho.getDataEmpenho());
        dto.setValorEmpenho(empenho.getValorEmpenho());
        dto.setObservacao(empenho.getObservacao());
        dto.setProtocoloDespesa(empenho.getDespesa().getProtocolo());
        return dto;
    }
}

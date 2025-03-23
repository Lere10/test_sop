package com.lere.sop.service;

import com.lere.sop.dto.PagamentoDTO;
import com.lere.sop.entity.Empenho;
import com.lere.sop.entity.Pagamento;
import com.lere.sop.repository.EmpenhoRepository;
import com.lere.sop.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PagamentoService {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private EmpenhoRepository empenhoRepository;

    public PagamentoDTO salvar(PagamentoDTO dto) {
        UUID numeroEmpenhoUUID = UUID.fromString(dto.getNumeroEmpenho());
Empenho empenho = empenhoRepository.findById(numeroEmpenhoUUID)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Empenho não encontrado"));

        Pagamento pagamento = new Pagamento();
        pagamento.setDataPagamento(dto.getDataPagamento());
        pagamento.setValorPagamento(dto.getValorPagamento());
        pagamento.setObservacao(dto.getObservacao());
        pagamento.setEmpenho(empenho);

        Pagamento salvo = pagamentoRepository.save(pagamento);
        return toDTO(salvo);
    }

    public List<PagamentoDTO> listarTodos() {
        return pagamentoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PagamentoDTO buscarPorId(UUID numeroPagamento) {
        Pagamento pagamento = pagamentoRepository.findById(numeroPagamento)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pagamento não encontrado"));
        return toDTO(pagamento);
    }

    public void deletar(UUID numeroPagamento) {
        pagamentoRepository.deleteById(numeroPagamento);
    }

    // Conversor de entidade para DTO
    private PagamentoDTO toDTO(Pagamento pagamento) {
        PagamentoDTO dto = new PagamentoDTO();
        dto.setNumeroPagamento(pagamento.getNumeroPagamento().toString());
        dto.setDataPagamento(pagamento.getDataPagamento());
        dto.setValorPagamento(pagamento.getValorPagamento());
        dto.setObservacao(pagamento.getObservacao());
        dto.setNumeroEmpenho(pagamento.getEmpenho().getNumeroEmpenho().toString());

        return dto;
    }
}

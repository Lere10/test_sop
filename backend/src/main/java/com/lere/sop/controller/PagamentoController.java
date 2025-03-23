package com.lere.sop.controller;

import com.lere.sop.dto.PagamentoDTO;
import com.lere.sop.service.PagamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    @Autowired
    private PagamentoService pagamentoService;

    @PostMapping
    public ResponseEntity<PagamentoDTO> criar(@RequestBody PagamentoDTO dto) {
        PagamentoDTO pagamento = pagamentoService.salvar(dto);
        return ResponseEntity.ok(pagamento);
    }

    @GetMapping
    public ResponseEntity<List<PagamentoDTO>> listarTodos() {
        return ResponseEntity.ok(pagamentoService.listarTodos());
    }

    @GetMapping("/{numeroPagamento}")
    public ResponseEntity<PagamentoDTO> buscarPorId(@PathVariable UUID numeroPagamento) {
        return ResponseEntity.ok(pagamentoService.buscarPorId(numeroPagamento));
    }

    @DeleteMapping("/{numeroPagamento}")
    public ResponseEntity<Void> deletar(@PathVariable UUID numeroPagamento) {
        pagamentoService.deletar(numeroPagamento);
        return ResponseEntity.noContent().build();
    }
}

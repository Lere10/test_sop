package com.lere.sop.controller;

import com.lere.sop.dto.DespesaDTO;
import com.lere.sop.entity.Despesa;
import com.lere.sop.service.DespesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/despesas")
public class DespesaController {

    @Autowired
    private DespesaService despesaService;

    @GetMapping
    public ResponseEntity<List<Despesa>> listarTodas() {
        return ResponseEntity.ok(despesaService.listarTodas());
    }

    @GetMapping("/{competencia}")
    public ResponseEntity<DespesaDTO> buscarPorProtocoloECompetencia(
            @PathVariable String protocolo,
            @PathVariable String competencia) {
        DespesaDTO dto = despesaService.buscarPorProtocoloECompetencia(protocolo, competencia);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<Despesa> criar(@RequestBody Despesa despesa) {
        Despesa nova = despesaService.salvar(despesa);
        return ResponseEntity.ok(nova);
    }

    @DeleteMapping("/{protocolo}")
    public ResponseEntity<Void> deletar(@PathVariable String protocolo) {
        despesaService.deletarPorProtocolo(protocolo);
        return ResponseEntity.noContent().build();
    }
}
package com.lere.sop.controller;

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
        List<Despesa> despesas = despesaService.listarTodas();
        return ResponseEntity.ok(despesas);
    }

    @GetMapping("/{protocolo}")
    public ResponseEntity<Despesa> buscarPorProtocolo(@PathVariable String protocolo) {
        return despesaService.buscarPorProtocolo(protocolo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Despesa> criar(@RequestBody Despesa despesa) {
        Despesa novaDespesa = despesaService.salvar(despesa);
        return ResponseEntity.ok(novaDespesa);
    }

    @DeleteMapping("/{protocolo}")
    public ResponseEntity<Void> deletar(@PathVariable String protocolo) {
        despesaService.deletarPorProtocolo(protocolo);
        return ResponseEntity.noContent().build();
    }
}

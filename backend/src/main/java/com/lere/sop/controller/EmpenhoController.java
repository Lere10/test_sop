package com.lere.sop.controller;

import com.lere.sop.dto.EmpenhoDTO;
import com.lere.sop.entity.Empenho;
import com.lere.sop.service.EmpenhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/empenhos")
public class EmpenhoController {

    @Autowired
    private EmpenhoService empenhoService;

   @PostMapping
public ResponseEntity<EmpenhoDTO> criar(@RequestBody EmpenhoDTO dto) {
    EmpenhoDTO empenhoSalvo = empenhoService.salvar(dto);
    return ResponseEntity.ok(empenhoSalvo);
}


    // @GetMapping
    // public ResponseEntity<List<Empenho>> listarTodos() {
    //     return ResponseEntity.ok(empenhoService.listarTodos());
    // }
    @GetMapping
        public ResponseEntity<List<EmpenhoDTO>> listarTodos() {
            return ResponseEntity.ok(empenhoService.listarTodos());
}


    @GetMapping("/{id}")
public ResponseEntity<EmpenhoDTO> buscarPorId(@PathVariable("id") UUID id) {
    EmpenhoDTO dto = empenhoService.buscarPorId(id);
    return ResponseEntity.ok(dto);
}

    @DeleteMapping("/{numeroEmpenho}")
    public ResponseEntity<Void> deletar(@PathVariable UUID numeroEmpenho) {
        empenhoService.deletar(numeroEmpenho);
        return ResponseEntity.noContent().build();
    }
}

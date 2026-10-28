package com.example.bestiario.model;

// ==========================================================================
// ARQUIVO FORNECIDO PELA PROVA - não precisa (nem deve) ser alterado.
// Na prova, o trabalho é LER este arquivo e chamar os métodos certos.
// ==========================================================================

import java.util.List;

/**
 * Representa um caçador lido de data/cacadores.csv.
 * O campo monstros guarda apenas os IDs dos monstros capturados
 * (relação caçador -> monstros, igual treinador -> pokémon na Atividade 03).
 */
public record Cacador(
        String nome,
        int nivel,        // 1 a 10
        String guilda,
        List<Integer> monstros) {
}

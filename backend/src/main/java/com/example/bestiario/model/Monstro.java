package com.example.bestiario.model;

// ==========================================================================
// ARQUIVO FORNECIDO PELA PROVA - não precisa (nem deve) ser alterado.
// Na prova, o trabalho é LER este arquivo e chamar os métodos certos.
// ==========================================================================

import java.util.List;

/**
 * Representa um monstro lido de data/monstros.csv.
 * Record: os "getters" são id(), nome(), elementos()... e o Jackson
 * serializa automaticamente para JSON com esses mesmos nomes.
 */
public record Monstro(
        int id,
        String nome,
        List<String> elementos,   // 1 ou 2 elementos (ex.: ["Dragão", "Fogo"])
        int vida,
        int ataque,
        int defesa,
        int magia,
        int resistencia,
        int velocidade,
        String raridade,          // Comum | Raro | Épico | Lendário
        String habitat,
        String descricao) {

    /** Soma de todos os atributos — útil para ordenação/ranking. */
    public int total() {
        return vida + ataque + defesa + magia + resistencia + velocidade;
    }
}

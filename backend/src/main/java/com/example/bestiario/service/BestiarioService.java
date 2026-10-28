package com.example.bestiario.service;

// ==========================================================================
// ARQUIVO FORNECIDO PELA PROVA - não precisa (nem deve) ser alterado.
// Na prova, o trabalho é LER este arquivo e chamar os métodos certos.
// ==========================================================================

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.TreeSet;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.example.bestiario.model.Cacador;
import com.example.bestiario.model.Monstro;

import jakarta.annotation.PostConstruct;

/**
 * Lê os CSVs (separador ";", charset UTF-8, listas separadas por "|")
 * uma única vez na inicialização e mantém tudo em memória.
 */
@Service
public class BestiarioService {

    private static final String CSV_MONSTROS = "data/monstros.csv";
    private static final String CSV_CACADORES = "data/cacadores.csv";
    private static final Locale PT_BR = Locale.forLanguageTag("pt-BR");

    private List<Monstro> monstros = new ArrayList<>();
    private List<Cacador> cacadores = new ArrayList<>();

    @PostConstruct
    public void carregar() {
        this.monstros = lerLinhas(CSV_MONSTROS).stream()
                .map(this::paraMonstro)
                .sorted(Comparator.comparingInt(Monstro::id))
                .toList();

        this.cacadores = lerLinhas(CSV_CACADORES).stream()
                .map(this::paraCacador)
                .sorted(Comparator.comparing(Cacador::nome))
                .toList();
    }

    // ------------------------------------------------------------------
    // Métodos públicos (os que o Controller deve usar)
    // ------------------------------------------------------------------

    public List<Monstro> listarMonstros() {
        return monstros;
    }

    /**
     * Filtro simples: qualquer parâmetro nulo/vazio é ignorado.
     * - elemento: compara (ignorando maiúsc./minúsc.) com QUALQUER elemento do monstro
     * - texto: procura no nome OU compara com o id exato
     */
    public List<Monstro> filtrar(String elemento, String texto) {
        String busca = normalizar(texto);
        return monstros.stream()
                .filter(m -> vazio(elemento)
                        || m.elementos().stream().anyMatch(e -> e.equalsIgnoreCase(elemento.trim())))
                .filter(m -> busca.isEmpty()
                        || normalizar(m.nome()).contains(busca)
                        || String.valueOf(m.id()).equals(busca))
                .toList();
    }

    public Optional<Monstro> buscarPorId(int id) {
        return monstros.stream().filter(m -> m.id() == id).findFirst();
    }

    /** Elementos distintos, em ordem alfabética, para popular o filtro. */
    public List<String> listarElementos() {
        return monstros.stream()
                .flatMap(m -> m.elementos().stream())
                .collect(java.util.stream.Collectors.toCollection(TreeSet::new))
                .stream().toList();
    }

    public List<Cacador> listarCacadores() {
        return cacadores;
    }

    /**
     * Monstros capturados por um caçador (pelo nome, ignorando maiúsc./minúsc.).
     * Retorna Optional.empty() se o caçador não existir.
     */
    public Optional<List<Monstro>> monstrosDoCacador(String nomeCacador) {
        return cacadores.stream()
                .filter(c -> c.nome().equalsIgnoreCase(nomeCacador.trim()))
                .findFirst()
                .map(c -> c.monstros().stream()
                        .map(this::buscarPorId)
                        .flatMap(Optional::stream)
                        .toList());
    }

    // ------------------------------------------------------------------
    // Leitura dos CSVs
    // ------------------------------------------------------------------

    private List<String> lerLinhas(String caminho) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new ClassPathResource(caminho).getInputStream(), StandardCharsets.UTF_8))) {
            return reader.lines()
                    .skip(1) // cabeçalho
                    .filter(l -> !l.isBlank())
                    .toList();
        } catch (IOException e) {
            throw new UncheckedIOException("Erro ao ler " + caminho, e);
        }
    }

    // id;nome;elementos;vida;ataque;defesa;magia;resistencia;velocidade;raridade;habitat;descricao
    private Monstro paraMonstro(String linha) {
        String[] c = linha.split(";", -1);
        return new Monstro(
                Integer.parseInt(c[0].trim()),
                c[1].trim(),
                Arrays.stream(c[2].split("\\|")).map(String::trim).toList(),
                Integer.parseInt(c[3].trim()),
                Integer.parseInt(c[4].trim()),
                Integer.parseInt(c[5].trim()),
                Integer.parseInt(c[6].trim()),
                Integer.parseInt(c[7].trim()),
                Integer.parseInt(c[8].trim()),
                c[9].trim(),
                c[10].trim(),
                c[11].trim());
    }

    // nome;nivel;guilda;monstros
    private Cacador paraCacador(String linha) {
        String[] c = linha.split(";", -1);
        List<Integer> ids = Arrays.stream(c[3].split("\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::parseInt)
                .toList();
        return new Cacador(c[0].trim(), Integer.parseInt(c[1].trim()), c[2].trim(), ids);
    }

    private boolean vazio(String s) {
        return s == null || s.isBlank();
    }

    private String normalizar(String s) {
        return s == null ? "" : s.trim().toLowerCase(PT_BR);
    }
}

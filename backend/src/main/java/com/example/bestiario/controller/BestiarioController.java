// QUESTÃO 1 (8 pts) - API REST
// O package precisa bater com a pasta: .../com/example/bestiario/controller
package com.example.bestiario.controller;

// Imports que costumam faltar ("cannot be resolved to a type"):
// List vem de java.util (NÃO de java.awt); ResponseEntity de org.springframework.http.
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bestiario.model.Cacador;
import com.example.bestiario.model.Monstro;
import com.example.bestiario.service.BestiarioService;

/*
 * @RestController (e NÃO @Controller, como na AV1):
 *   - @Controller  -> o retorno String é o NOME DE UMA VIEW do Thymeleaf ("index").
 *   - @RestController -> o retorno é convertido em JSON e enviado direto na resposta.
 *   O React só quer os dados, então é @RestController.
 *   [checklist: 2 pts junto com @RequestMapping e a injeção]
 *
 * @RequestMapping("/api"): prefixo comum de todas as rotas da classe.
 *   Assim @GetMapping("/monstros") vira GET /api/monstros.
 *
 * @CrossOrigin: o React roda em http://localhost:5173 e a API em :8080.
 *   Portas diferentes = "origens" diferentes, e o NAVEGADOR bloqueia o fetch
 *   se a API não disser que aquela origem é permitida (CORS).
 *   Sem isso, o endpoint funciona no navegador digitando a URL, mas o React
 *   mostra erro "blocked by CORS policy" no console (F12). [checklist: 1 pt]
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class BestiarioController {

    // final + construtor = injeção de dependência pelo construtor (mesmo padrão da AV1).
    // O Spring vê que o construtor pede um BestiarioService (@Service) e entrega a instância.
    // Não precisa de @Autowired quando a classe tem um único construtor.
    private final BestiarioService service;

    public BestiarioController(BestiarioService service) {
        this.service = service;
    }

    /*
     * GET /api/monstros
     * GET /api/monstros?elemento=Fogo
     * GET /api/monstros?elemento=Fogo&texto=dra
     *
     * Filtros OPCIONAIS vêm da query string -> @RequestParam(required = false).
     * Se o parâmetro não vier, chega null, e o filtrar() do service já ignora
     * null/vazio (leia o javadoc do método no service!).
     *
     * ATENÇÃO à ordem: a assinatura é filtrar(String elemento, String texto).
     * Inverter os dois compila normalmente, mas o filtro não funciona.
     *
     * O nome da variável Java vira o nome do parâmetro na URL (elemento, texto).
     * [checklist: 2 pts]
     */
    @GetMapping("/monstros")
    public List<Monstro> listarMonstros(
            @RequestParam(required = false) String elemento,
            @RequestParam(required = false) String texto) {
        return service.filtrar(elemento, texto);
    }

    /*
     * GET /api/monstros/9   -> 200 + JSON do monstro
     * GET /api/monstros/999 -> 404
     *
     * Dado que faz parte do CAMINHO -> @PathVariable (o {id} da rota).
     * Dado opcional/filtro -> @RequestParam. Esse é o critério para escolher.
     *
     * Por que ResponseEntity? Quando o método retorna só Monstro, a resposta é
     * sempre 200. Para controlar o status HTTP (404), o retorno vira ResponseEntity.
     *
     * O service devolve Optional<Monstro>:
     *   .map(ResponseEntity::ok)                -> se tem valor: 200 com o monstro
     *   .orElse(ResponseEntity.notFound().build()) -> se está vazio: 404 sem corpo
     * [checklist: 1,5 pt]
     */
    @GetMapping("/monstros/{id}")
    public ResponseEntity<Monstro> buscarMonstro(@PathVariable int id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /*
     * GET /api/elementos -> ["Dragão","Elétrico","Fogo",...]
     * Usado pelo React para montar o <select> de filtro com dados da API,
     * em vez de digitar os elementos "na mão" no front.
     */
    @GetMapping("/elementos")
    public List<String> listarElementos() {
        return service.listarElementos();
    }

    /*
     * GET /api/cacadores
     * Cada caçador vem com "monstros": [1, 9, 15] (só os IDs).
     * O front transforma IDs em nomes (ver CacadoresView.jsx).
     */
    @GetMapping("/cacadores")
    public List<Cacador> listarCacadores() {
        return service.listarCacadores();
    }

    /*
     * GET /api/cacadores/Lina%20Voss/monstros -> lista de monstros | 404
     *
     * Mesmo padrão do buscarMonstro: o service devolve Optional<List<Monstro>>,
     * vazio quando o caçador não existe -> 404.
     * O espaço no nome chega como %20 na URL e o Spring decodifica sozinho.
     * [checklist: os 3 últimos endpoints = 1,5 pt]
     */
    @GetMapping("/cacadores/{nome}/monstros")
    public ResponseEntity<List<Monstro>> monstrosDoCacador(@PathVariable String nome) {
        return service.monstrosDoCacador(nome)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

# 🐉 AV2 (SIMULADO) — Bestiário: Spring Boot + React

**Valor: 25 pontos** · **Tempo sugerido: 2h30** (cronometre!)

Simulado no formato da AV1 (Candidatos TSE) do Prof. João Paulo Aramuni, agora com **React + Vite** no front e **Spring Boot** expondo uma **API REST**. A parte React segue a ideia da Atividade 03 (Pokédex), com outro tema para você não depender de copiar o projeto.

## Regras (iguais às da prova real)

- Consulta permitida **apenas** aos seus próprios projetos (AV1, Pokédex, labs) e à documentação oficial (spring.io, react.dev, vite.dev, w3.org).
- **Sem IA e sem Google.** Treine como se fosse valendo.
- Back: Java 25, Spring Boot, Maven (dependência: **Spring Web**). Front: React + Vite.
- Projeto que não roda: no máximo 50% da nota. API em `http://localhost:8080`, React em `http://localhost:5173`.

## Arquivos fornecidos

```
data/monstros.csv           → copiar para src/main/resources/data/
data/cacadores.csv          → copiar para src/main/resources/data/
data/bestiario-data.json    → só para o "Modo só React" (ver no fim)
fornecidos/model/Monstro.java
fornecidos/model/Cacador.java
fornecidos/service/BestiarioService.java
```

Pacote base: `com.example.bestiario`. Deixe a classe `BestiarioApplication` **na raiz** do pacote (`com.example.bestiario`), senão o Spring não encontra `controller`, `service` etc. (ou use `scanBasePackages`).

Leia o `BestiarioService` antes de começar: os métodos já estão prontos, você só precisa chamá-los.

---

## [8,0 pts] Questão 1 — `controller/BestiarioController.java` (API REST)

Construa o controller que expõe os dados em JSON.

| Endpoint | Retorno |
|---|---|
| `GET /api/monstros` | lista de monstros; aceita `?elemento=...&texto=...` opcionais |
| `GET /api/monstros/{id}` | o monstro, ou **404** se não existir |
| `GET /api/elementos` | lista de elementos distintos |
| `GET /api/cacadores` | lista de caçadores |
| `GET /api/cacadores/{nome}/monstros` | monstros daquele caçador, ou **404** |

**Dicas:**

- Agora é `@RestController`, **não** `@Controller`: não há view do Thymeleaf, o retorno vira JSON automaticamente.
- Use `@RequestMapping("/api")` na classe para não repetir o prefixo.
- Injete o `BestiarioService` pelo construtor (igual na AV1).
- Filtros opcionais: `@RequestParam(required = false)`. Confira a **ordem** dos parâmetros de `filtrar(...)` no service.
- Para o 404, use `ResponseEntity`. O service devolve `Optional`, então `.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build())` resolve.
- **CORS**: o React roda em outra porta (5173). Sem liberar, o navegador bloqueia o `fetch`. Use `@CrossOrigin(origins = "http://localhost:5173")` na classe.
- Teste no navegador antes de ir para o React: `http://localhost:8080/api/monstros?elemento=fogo` deve trazer 4 monstros; `/api/monstros/999` deve dar 404.

---

## [9,0 pts] Questão 2 — React: listagem, pesquisa e filtro

Crie o projeto com `npm create vite@latest bestiario-react -- --template react`.

A tela principal deve mostrar os monstros vindos da API em uma grade de cards. Cada card exibe, no mínimo: **ID, nome, elemento(s), raridade e os 6 atributos** (vida, ataque, defesa, magia, resistência, velocidade).

Requisitos:

1. Buscar os dados com `fetch` dentro de `useEffect` (array de dependências vazio) e guardar em `useState`.
2. Mostrar **"Carregando..."** enquanto busca e uma **mensagem de erro** se a API estiver desligada (teste desligando o Spring!).
3. **Pesquisa** por nome **ou** ID, atualizando a lista **enquanto o usuário digita**.
4. **Filtro por elemento** (select ou botões), com as opções vindas de `GET /api/elementos` e uma opção "Todos".
5. Pesquisa e filtro devem funcionar **juntos**.
6. Mostrar **"X monstro(s) encontrado(s)"** e uma mensagem quando nenhum for encontrado.
7. Componentização mínima: `Header`, `SearchBar`, `FiltroElemento`, `MonstroList`, `MonstroCard`.

**Dicas:**

- A lista filtrada é **estado derivado**: calcule com `.filter()` a partir de `monstros`, `busca` e `elemento`. Não crie um `useState` só para ela.
- Inputs controlados: `value={busca}` + `onChange={(e) => onBuscaChange(e.target.value)}`. O estado fica no `App` e desce por **props**.
- `map()` precisa de `key` (use o `id`).
- Um monstro pode ter 2 elementos: use `monstro.elementos.includes(elemento)`.
- Centralize a URL base (`http://localhost:8080/api`) em uma constante ou arquivo `api.js`.

---

## [5,0 pts] Questão 3 — Detalhes e Caçadores

**a) Detalhes (3 pts):** ao clicar em um card, abrir um **modal** com todos os dados do monstro (incluindo habitat e descrição). O modal deve buscar o monstro em `GET /api/monstros/{id}` (não reaproveitar o objeto da lista; o objetivo é praticar a integração). Atributos como **barras de progresso** (máximo 150). Fechar pelo botão ✕ e clicando fora do modal.

**b) Caçadores (2 pts):** criar uma aba/seção "Caçadores", alternada com a aba "Bestiário" via `useState` (sem router). Para cada caçador: nome, guilda, nível e os **nomes** dos monstros capturados. Ordenar por nível (maior primeiro). Clicar no nome de um monstro abre o mesmo modal de detalhes.

**Dicas:**

- Modal = renderização condicional: `{idSelecionado && <MonstroDetalhes id={idSelecionado} onFechar={...} />}`.
- `useEffect(..., [id])` dentro do modal para buscar sempre que o id mudar.
- Para fechar clicando fora sem fechar ao clicar dentro: `onClick={(e) => e.stopPropagation()}` na caixa do modal.
- `/api/cacadores` traz só os **IDs** dos monstros. Para mostrar nomes, monte um mapa `id → monstro` a partir da lista que você já tem (ou use o endpoint `/api/cacadores/{nome}/monstros`; lembre de `encodeURIComponent` por causa dos espaços).
- Barra: uma `div` externa e uma interna com `style={{ width: `${(valor / 150) * 100}%` }}`.
- `.sort()` altera o array original: ordene uma cópia (`[...cacadores].sort(...)`).

---

## [3,0 pts] Questão 4 — CSS

- Grade responsiva com CSS Grid: `repeat(auto-fill, minmax(220px, 1fr))`.
- Cor por elemento nas tags (fogo, água, planta…). Dica: transforme "Água" em classe `elemento-agua` removendo acentos com `.normalize("NFD").replace(/[\u0300-\u036f]/g, "")`.
- Efeito de hover nos cards e destaque visual da raridade (ex.: borda dourada para Lendário).
- Modal centralizado com fundo escurecido (`position: fixed; inset: 0;`).

---

## ✅ Checklist de autoavaliação

| Item | Pts |
|---|---|
| `@RestController` + `@RequestMapping("/api")` + injeção por construtor | 2 |
| `/api/monstros` com filtros opcionais funcionando | 2 |
| `/api/monstros/{id}` com 404 correto | 1,5 |
| `/api/elementos`, `/api/cacadores`, `/api/cacadores/{nome}/monstros` | 1,5 |
| CORS liberado (React consegue consumir) | 1 |
| `useEffect` + `fetch` + loading + erro | 2 |
| Cards com todos os campos, `map` com `key` | 2 |
| Pesquisa por nome/ID em tempo real | 1,5 |
| Filtro por elemento (opções da API) combinado com a pesquisa | 1,5 |
| Contagem + "nenhum encontrado" + componentização pedida | 2 |
| Modal com fetch por id, barras, fechar fora/✕ | 3 |
| Aba Caçadores com nomes dos monstros, ordenação, clique abre modal | 2 |
| CSS (grid, cores por elemento, hover, raridade, modal) | 3 |
| **Total** | **25** |

---

## 🔁 Modo só React (se a prova for só React)

Ignore a Questão 1 e redistribua os 8 pontos em Q2/Q3. Copie `data/bestiario-data.json` para `src/data/` e importe direto:

```js
import dados from "./data/bestiario-data.json";
// dados.monstros, dados.cacadores
```

Os elementos você extrai com `[...new Set(dados.monstros.flatMap(m => m.elementos))].sort()`. No modal, busque o monstro por id com `.find()`.

## ⭐ Extras (se sobrar tempo)

Ordenação por atributo (select), favoritos com estado, botão "monstro aleatório", comparar dois monstros lado a lado.

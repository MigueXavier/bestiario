# 🐉 Bestiário — resolução comentada do AV2 simulado

Projeto completo (Spring Boot + React) com comentários explicando cada decisão.
Os comentários indicam a questão (Q1, Q2, Q3a, Q3b, Q4) e o item do checklist do `ENUNCIADO.md`.

## Estrutura

```
backend/                                  Spring Boot (Q1)
├── pom.xml                               dependência: só Spring Web (webmvc)
├── mvnw / mvnw.cmd                       Maven Wrapper (não precisa ter Maven instalado)
└── src/main/
    ├── java/com/example/bestiario/
    │   ├── BestiarioApplication.java     classe principal (na RAIZ do pacote)
    │   ├── controller/
    │   │   └── BestiarioController.java  ★ RESOLUÇÃO DA Q1
    │   ├── model/                        fornecido pela prova
    │   └── service/                      fornecido pela prova
    └── resources/
        ├── application.properties
        └── data/                         monstros.csv, cacadores.csv

frontend/                                 React + Vite (Q2, Q3, Q4)
└── src/
    ├── api.js                            fetch + tratamento de erro
    ├── App.jsx                           ★ estados, useEffect, filtro derivado
    ├── index.css                         ★ Q4
    └── components/
        ├── Header.jsx                    abas (Q3b)
        ├── SearchBar.jsx                 pesquisa (Q2)
        ├── FiltroElemento.jsx            filtro (Q2)
        ├── MonstroList.jsx / MonstroCard.jsx
        ├── ElementoTag.jsx               cor por elemento (Q4)
        ├── MonstroDetalhes.jsx           ★ modal com fetch por id (Q3a)
        ├── StatBar.jsx                   barras (Q3a)
        └── CacadoresView.jsx             ★ caçadores (Q3b)
```

## Como rodar

**1. Back-end** (terminal 1):
```
cd backend
./mvnw spring-boot:run        (Windows: mvnw.cmd spring-boot:run)
```
Teste: http://localhost:8080/api/monstros?elemento=Fogo → 4 monstros.
Teste: http://localhost:8080/api/monstros/999 → 404.

> No VS Code, também dá para abrir a pasta `backend` e dar Run na `BestiarioApplication`.

**2. Front-end** (terminal 2):
```
cd frontend
npm install
npm run dev
```
Abra http://localhost:5173 com a API rodando.

## Requisitos
- JDK 25 (o `pom.xml` usa `java.version=25`, como na prova) e Spring Boot 4.0.
- Node.js 20+.

## Como comparar com o seu
1. Rode o seu projeto e o checklist do `ENUNCIADO.md`, dando nota a si mesmo **antes** de abrir este.
2. Compare primeiro o `BestiarioController.java`: anotações, tipos de retorno e uso do `Optional`.
3. Depois o `App.jsx`: onde fica cada estado e como a lista filtrada é calculada.
4. Os pontos marcados como "PEGADINHA" ou "erro clássico" nos comentários são os que mais tiram nota.

## Erros que mais tiram nota
- `@Controller` em vez de `@RestController`.
- Esquecer o `@CrossOrigin` → "blocked by CORS policy" no console.
- Application fora da raiz do pacote → todos os endpoints dão 404.
- `package` diferente da pasta, ou `List` sem `import java.util.List`.
- Lista filtrada em `useState` separado.
- `useEffect` sem `[]` → loop de requisições.
- `map` sem `key`; `.sort()` direto no estado.
- Achar que `fetch` dá erro em 404 (não dá: confira `resposta.ok`).

// QUESTÃO 2 - camada de acesso à API
// Centralizar a URL base aqui evita espalhar "http://localhost:8080/api" pelo código.
// Se a porta mudar, muda em um lugar só.
const BASE_URL = "http://localhost:8080/api";

// Função genérica: faz o GET e já devolve o JSON convertido em objeto JS.
async function getJson(caminho) {
  const resposta = await fetch(`${BASE_URL}${caminho}`);

  // PEGADINHA: fetch NÃO dá erro em 404/500, só quando a rede falha
  // (ex.: API desligada). Por isso conferimos resposta.ok (status 200-299)
  // e lançamos o erro manualmente. Assim o .catch() do componente pega os dois casos.
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} ao acessar ${caminho}`);
  }
  return resposta.json();
}

// Uma função por endpoint do BestiarioController.
export const buscarMonstros = () => getJson("/monstros");
export const buscarMonstro = (id) => getJson(`/monstros/${id}`);
export const buscarElementos = () => getJson("/elementos");
export const buscarCacadores = () => getJson("/cacadores");

// Não usado no gabarito (CacadoresView resolve os nomes com o mapa id -> monstro),
// mas é como se consumiria o endpoint do caçador. encodeURIComponent troca
// o espaço de "Lina Voss" por %20 para a URL ficar válida.
export const buscarMonstrosDoCacador = (nome) =>
  getJson(`/cacadores/${encodeURIComponent(nome)}/monstros`);

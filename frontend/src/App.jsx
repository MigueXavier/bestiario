import { useEffect, useState } from "react";
import { buscarCacadores, buscarElementos, buscarMonstros } from "./api";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import FiltroElemento from "./components/FiltroElemento";
import MonstroList from "./components/MonstroList";
import MonstroDetalhes from "./components/MonstroDetalhes";
import CacadoresView from "./components/CacadoresView";

/*
 * App = componente "dono" do estado.
 * Regra: o estado fica no componente mais alto que precisa dele, desce para os
 * filhos por PROPS, e as mudanças sobem por FUNÇÕES passadas como props
 * (ex.: onBuscaChange={setBusca}).
 */
export default function App() {
  // ---------- Estados de DADOS (vindos da API) ----------
  const [monstros, setMonstros] = useState([]); // começa vazio, não null, para .filter/.map não quebrarem
  const [elementos, setElementos] = useState([]);
  const [cacadores, setCacadores] = useState([]);

  // ---------- Estados de REQUISIÇÃO (Q2 item 2) ----------
  const [carregando, setCarregando] = useState(true); // true: já começa carregando
  const [erro, setErro] = useState(null);

  // ---------- Estados de INTERFACE (o que o usuário controla) ----------
  const [busca, setBusca] = useState("");           // texto da SearchBar
  const [elemento, setElemento] = useState("");     // "" = "Todos"
  const [aba, setAba] = useState("bestiario");      // Q3b: alterna abas sem router
  const [idSelecionado, setIdSelecionado] = useState(null); // Q3a: null = modal fechado

  /*
   * Q2 item 1: carga inicial com useEffect.
   * O array de dependências VAZIO [] faz rodar UMA vez, quando o componente monta.
   * Sem o [], rodaria a cada render -> setMonstros causa render -> loop infinito
   * de requisições.
   *
   * Promise.all dispara as 3 requisições em paralelo e espera todas.
   * .finally roda dando certo ou errado, então o "carregando" sempre desliga.
   */
  useEffect(() => {
    Promise.all([buscarMonstros(), buscarElementos(), buscarCacadores()])
      .then(([m, e, c]) => {
        setMonstros(m);
        setElementos(e);
        setCacadores(c);
      })
      .catch((err) => setErro(err.message)) // API desligada cai aqui ("Failed to fetch")
      .finally(() => setCarregando(false));
  }, []);

  /*
   * Q2 itens 3, 4 e 5: ESTADO DERIVADO.
   * A lista filtrada é CALCULADA a cada render a partir de monstros + busca + elemento.
   * Não existe useState para ela: se existisse, teria que ser sincronizada à mão
   * e ficaria desatualizada (erro clássico).
   * Como busca/elemento são estados, digitar causa um render e a lista recalcula
   * sozinha -> "atualiza enquanto digita".
   */
  const termo = busca.trim().toLowerCase();
  const filtrados = monstros.filter((m) => {
    // Pesquisa por nome (parcial) OU id (exato). String(m.id) porque o id é número.
    const bateTexto =
      termo === "" || m.nome.toLowerCase().includes(termo) || String(m.id) === termo;
    // includes no ARRAY de elementos: cobre monstros com 2 elementos.
    const bateElemento = elemento === "" || m.elementos.includes(elemento);
    // Os dois precisam passar -> filtros combinados (item 5).
    return bateTexto && bateElemento;
  });

  // Q3b: mapa { 1: {...Brasalume}, 2: {...} } para achar um monstro pelo id em O(1)
  // na aba de caçadores (que só recebe IDs da API).
  const monstrosPorId = Object.fromEntries(monstros.map((m) => [m.id, m]));

  return (
    // <> </> = Fragment: agrupa sem criar uma div extra no HTML.
    <>
      <Header aba={aba} onTrocarAba={setAba} />

      <main className="conteudo">
        {/* Renderização condicional com &&: só aparece se a condição for true */}
        {carregando && <p className="aviso">Carregando...</p>}
        {erro && (
          <p className="aviso erro">
            Não foi possível carregar os dados ({erro}). A API está rodando em :8080?
          </p>
        )}

        {/* Aba Bestiário (Q2) */}
        {!carregando && !erro && aba === "bestiario" && (
          <>
            <section className="filtros">
              <SearchBar busca={busca} onBuscaChange={setBusca} />
              <FiltroElemento
                elementos={elementos}
                selecionado={elemento}
                onSelecionar={setElemento}
              />
            </section>

            {/* Q2 item 6: contagem */}
            <p className="contagem">{filtrados.length} monstro(s) encontrado(s)</p>

            {/* Q2 item 6: lista vazia. Ternário porque são DUAS alternativas. */}
            {filtrados.length === 0 ? (
              <p className="aviso">Nenhum monstro corresponde à pesquisa.</p>
            ) : (
              <MonstroList monstros={filtrados} onSelecionar={setIdSelecionado} />
            )}
          </>
        )}

        {/* Aba Caçadores (Q3b) */}
        {!carregando && !erro && aba === "cacadores" && (
          <CacadoresView
            cacadores={cacadores}
            monstrosPorId={monstrosPorId}
            onSelecionarMonstro={setIdSelecionado} // mesmo setter -> abre o MESMO modal
          />
        )}
      </main>

      {/*
        Q3a: o modal fica FORA das abas, então funciona nas duas.
        Ele só existe quando há um id selecionado; fechar = voltar para null.
      */}
      {idSelecionado && (
        <MonstroDetalhes id={idSelecionado} onFechar={() => setIdSelecionado(null)} />
      )}
    </>
  );
}

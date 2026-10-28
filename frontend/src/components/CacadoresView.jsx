/*
 * Q3b: aba de caçadores (equivalente aos treinadores da Pokédex).
 * A API manda cada caçador com "monstros": [1, 9, 15] (IDs).
 * Para mostrar NOMES, usamos o mapa id -> monstro que o App montou.
 */
export default function CacadoresView({ cacadores, monstrosPorId, onSelecionarMonstro }) {
  // Ordenar por nível, do maior para o menor.
  // [...cacadores] cria uma CÓPIA: .sort() altera o array original, e alterar
  // o estado diretamente é proibido no React (pode não re-renderizar / gerar bugs).
  // (a, b) => b.nivel - a.nivel  -> negativo/positivo decide a ordem (decrescente).
  const ordenados = [...cacadores].sort((a, b) => b.nivel - a.nivel);

  return (
    <div className="grade">
      {/* key = nome, que é único entre os caçadores */}
      {ordenados.map((c) => (
        <article key={c.nome} className="card cacador">
          <h2>{c.nome}</h2>
          <p className="guilda">{c.guilda}</p>
          <p className="nivel">Nível {c.nivel}</p>
          <div className="tags">
            {c.monstros.map((id) => {
              const m = monstrosPorId[id];
              // Segurança: se algum id não existir, não renderiza nada (null)
              if (!m) return null;
              return (
                // Clicar chama o MESMO setIdSelecionado do App -> abre o mesmo modal
                <button key={id} className="chip" onClick={() => onSelecionarMonstro(id)}>
                  {m.nome}
                </button>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}

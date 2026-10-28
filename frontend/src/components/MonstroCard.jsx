import ElementoTag, { slug } from "./ElementoTag";

// Q2: card com ID, nome, elementos, raridade e os 6 atributos.
export default function MonstroCard({ monstro, onClick }) {
  // Desestruturação: tira os campos do objeto para não repetir "monstro." toda hora
  const { id, nome, elementos, raridade } = monstro;

  return (
    // Q4: classe por raridade (raridade-lendario ganha borda dourada no CSS).
    // onClick no card inteiro abre o modal (Q3a).
    <article className={`card raridade-${slug(raridade)}`} onClick={onClick}>
      <div className="card-topo">
        {/* padStart: 9 -> "009", para ficar com cara de Pokédex */}
        <span className="card-id">#{String(id).padStart(3, "0")}</span>
        <span className="card-raridade">{raridade}</span>
      </div>
      <h2>{nome}</h2>
      <div className="tags">
        {/* Monstro pode ter 1 ou 2 elementos -> map */}
        {elementos.map((el) => (
          <ElementoTag key={el} elemento={el} />
        ))}
      </div>
      <ul className="atributos">
        <li>❤️ Vida <b>{monstro.vida}</b></li>
        <li>⚔️ Ataque <b>{monstro.ataque}</b></li>
        <li>🛡️ Defesa <b>{monstro.defesa}</b></li>
        <li>✨ Magia <b>{monstro.magia}</b></li>
        <li>🔰 Resist. <b>{monstro.resistencia}</b></li>
        <li>💨 Veloc. <b>{monstro.velocidade}</b></li>
      </ul>
    </article>
  );
}

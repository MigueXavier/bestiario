// Q3a: barra de progresso de um atributo (máximo 150, conforme o enunciado).
const MAXIMO = 150;

export default function StatBar({ rotulo, valor }) {
  return (
    <div className="stat">
      <span className="stat-rotulo">{rotulo}</span>
      {/* Trilho (fundo cinza) + barra interna com largura proporcional ao valor */}
      <div className="stat-trilho">
        {/* style no React é um OBJETO: {{ }} = chaves do JSX + chaves do objeto.
            Ex.: valor 75 -> width "50%" */}
        <div className="stat-barra" style={{ width: `${(valor / MAXIMO) * 100}%` }} />
      </div>
      <span className="stat-valor">{valor}</span>
    </div>
  );
}

import { useEffect, useState } from "react";
import { buscarMonstro } from "../api";
import ElementoTag from "./ElementoTag";
import StatBar from "./StatBar";

/*
 * Q3a: modal de detalhes.
 * Recebe só o ID (não o objeto) e busca o monstro em GET /api/monstros/{id}.
 * O enunciado pede isso de propósito, para praticar a integração com o endpoint.
 * O modal tem seus PRÓPRIOS estados de dado/erro, independentes do App.
 */
export default function MonstroDetalhes({ id, onFechar }) {
  const [monstro, setMonstro] = useState(null);
  const [erro, setErro] = useState(null);

  /*
   * Dependência [id]: roda ao abrir E sempre que o id mudar.
   * Exemplo: o modal está aberto e o usuário clica em outro monstro na aba Caçadores.
   * Zeramos o estado antes para não mostrar o monstro antigo durante a busca.
   */
  useEffect(() => {
    setMonstro(null);
    setErro(null);
    buscarMonstro(id)
      .then(setMonstro) // equivale a .then((dados) => setMonstro(dados))
      .catch((err) => setErro(err.message)); // ex.: 404 -> "Erro 404 ao acessar..."
  }, [id]);

  return (
    // Overlay = fundo escuro na tela toda. Clicar nele fecha o modal.
    <div className="overlay" onClick={onFechar}>
      {/*
        stopPropagation: sem ele, um clique DENTRO da caixa "subiria" (bubbling)
        até o overlay e fecharia o modal também.
      */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={onFechar} aria-label="Fechar">
          ✕
        </button>

        {/* Três estados possíveis: erro, carregando (sem dado e sem erro), pronto */}
        {erro && <p className="aviso erro">{erro}</p>}
        {!erro && !monstro && <p className="aviso">Carregando...</p>}

        {monstro && (
          <>
            <p className="card-id">
              #{String(monstro.id).padStart(3, "0")} · {monstro.raridade}
            </p>
            <h2>{monstro.nome}</h2>
            <div className="tags">
              {monstro.elementos.map((el) => (
                <ElementoTag key={el} elemento={el} />
              ))}
            </div>
            {/* Campos que só aparecem no detalhe (pedido da Q3a) */}
            <p className="descricao">{monstro.descricao}</p>
            <p className="habitat">📍 {monstro.habitat}</p>

            {/* Um StatBar reutilizado por atributo */}
            <StatBar rotulo="Vida" valor={monstro.vida} />
            <StatBar rotulo="Ataque" valor={monstro.ataque} />
            <StatBar rotulo="Defesa" valor={monstro.defesa} />
            <StatBar rotulo="Magia" valor={monstro.magia} />
            <StatBar rotulo="Resistência" valor={monstro.resistencia} />
            <StatBar rotulo="Velocidade" valor={monstro.velocidade} />
          </>
        )}
      </div>
    </div>
  );
}

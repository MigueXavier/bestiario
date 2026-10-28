// Q2 item 7 (componentização) + Q3b (troca de abas).
// O Header não guarda estado: recebe a aba atual e uma função para trocá-la.
export default function Header({ aba, onTrocarAba }) {
  return (
    <header className="header">
      <h1>🐉 Bestiário</h1>
      <nav className="abas">
        {/* className condicional: a aba ativa ganha a classe "ativa" (destaque no CSS) */}
        <button
          className={aba === "bestiario" ? "ativa" : ""}
          // Arrow function: passar onTrocarAba("bestiario") direto CHAMARIA a função
          // durante o render. Com () => ela só roda no clique.
          onClick={() => onTrocarAba("bestiario")}
        >
          Bestiário
        </button>
        <button
          className={aba === "cacadores" ? "ativa" : ""}
          onClick={() => onTrocarAba("cacadores")}
        >
          Caçadores
        </button>
      </nav>
    </header>
  );
}

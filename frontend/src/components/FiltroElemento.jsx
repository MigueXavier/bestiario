// Q2 item 4: filtro por elemento, com opções vindas de GET /api/elementos.
// Mesmo padrão do SearchBar: select controlado (value + onChange).
export default function FiltroElemento({ elementos, selecionado, onSelecionar }) {
  return (
    <select value={selecionado} onChange={(e) => onSelecionar(e.target.value)}>
      {/* Opção "Todos" com valor vazio: no App, elemento === "" significa "não filtrar" */}
      <option value="">Todos os elementos</option>
      {/* map gera uma <option> por elemento. key obrigatória: o próprio texto é único */}
      {elementos.map((el) => (
        <option key={el} value={el}>
          {el}
        </option>
      ))}
    </select>
  );
}

// Q2 item 3: pesquisa.
// INPUT CONTROLADO: o valor exibido vem do estado (value={busca}) e cada tecla
// atualiza o estado (onChange). O estado vive no App, por isso chega por props.
export default function SearchBar({ busca, onBuscaChange }) {
  return (
    <input
      type="text"
      className="busca"
      placeholder="Pesquisar por nome ou ID..."
      value={busca}
      // e.target.value = texto atual do input
      onChange={(e) => onBuscaChange(e.target.value)}
    />
  );
}

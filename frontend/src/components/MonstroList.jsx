import MonstroCard from "./MonstroCard";

// Q2 item 7: a lista só sabe "renderizar vários cards".
// Ela recebe a lista JÁ FILTRADA do App: não filtra nada aqui.
export default function MonstroList({ monstros, onSelecionar }) {
  return (
    <div className="grade">
      {/* key={m.id}: o React usa a key para saber qual item mudou entre renders.
          Sem ela aparece um warning no console. Use um id único, não o índice. */}
      {monstros.map((m) => (
        <MonstroCard key={m.id} monstro={m} onClick={() => onSelecionar(m.id)} />
      ))}
    </div>
  );
}

// Q4: cor por elemento.
// O CSS não aceita bem acentos em nome de classe, então "Água" vira "agua":
// normalize("NFD") separa a letra do acento (á -> a + ´) e o replace remove os acentos.
export function slug(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Componente reutilizado no card e no modal (reutilização de componentes).
export default function ElementoTag({ elemento }) {
  // Template string monta a classe: "tag elemento-agua", "tag elemento-dragao"...
  return <span className={`tag elemento-${slug(elemento)}`}>{elemento}</span>;
}

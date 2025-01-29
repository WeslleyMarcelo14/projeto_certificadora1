import { useState, useEffect } from "react";

/**
 * Hook para corrigir problemas de hidratação ao usar persistência no localStorage.
 * Ele sincroniza um estado global (ex.: Zustand) com o estado local do React.
 */
export const useStore = (store, callback) => {
  // Obtém o valor atual do estado global com base no callback fornecido
  const result = store(callback);

  // Estado local para armazenar o resultado e evitar problemas de hidratação
  const [data, setData] = useState();

  // Atualiza o estado local sempre que o resultado mudar
  useEffect(() => {
    setData(result);
  }, [result]);

  return data; // Retorna o dado sincronizado
};

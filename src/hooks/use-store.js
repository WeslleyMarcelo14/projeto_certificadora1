import { useState, useEffect } from "react";

/**
 * Este hook corrige problemas de hidratação ao usar persistência para salvar dados no localStorage.
 * @param {Function} store - A função do estado global (ex.: zustand).
 * @param {Function} callback - Uma função que seleciona ou transforma o estado desejado.
 * @returns {any} - O dado selecionado ou transformado, sincronizado com o estado global.
 */
export const useStore = (store, callback) => {
  // Obtém o valor atual do estado global com base no callback fornecido
  const result = store(callback);

  // Estado local para armazenar o resultado
  const [data, setData] = useState();

  // Efeito para atualizar o estado local sempre que o resultado mudar
  useEffect(() => {
    setData(result); // Atualiza o estado local com o resultado do estado global
  }, [result]);

  // Retorna o dado sincronizado
  return data;
};

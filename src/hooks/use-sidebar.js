import { create } from "zustand"; // Importa a função create para criar um estado global com Zustand
import { persist, createJSONStorage } from "zustand/middleware"; // Middleware para persistir o estado no armazenamento local
import { produce } from "immer"; // Utilizado para manipular o estado de forma imutável

// Cria o hook `useSidebar` para gerenciar o estado da barra lateral
export const useSidebar = create(
  persist(
    (set, get) => ({
      // Estado inicial
      isOpen: true, // Define se a barra lateral está aberta
      isHover: false, // Define se o estado de hover está ativo
      settings: { disabled: false, isHoverOpen: false }, // Configurações da barra lateral

      // Alterna o estado "isOpen" entre aberto e fechado
      toggleOpen: () => set({ isOpen: !get().isOpen }),

      // Atualiza diretamente o estado "isOpen"
      setIsOpen: (isOpen) => set({ isOpen }),

      // Atualiza diretamente o estado "isHover"
      setIsHover: (isHover) => set({ isHover }),

      // Retorna o estado atual da barra lateral com base em condições
      getOpenState: () => {
        const { isOpen, isHover, settings } = get(); // Obtém os valores do estado atual
        return isOpen || (settings.isHoverOpen && isHover); // Retorna verdadeiro se a barra lateral estiver aberta ou em hover com a configuração habilitada
      },

      // Atualiza as configurações da barra lateral de forma imutável
      setSettings: (settings) =>
        set(
          produce((state) => {
            state.settings = { ...state.settings, ...settings }; // Mescla as novas configurações com as existentes
          })
        ),
    }),
    {
      name: "sidebar", // Nome da chave para armazenamento no localStorage
      storage: createJSONStorage(() => localStorage), // Define o localStorage como armazenamento
    }
  )
);

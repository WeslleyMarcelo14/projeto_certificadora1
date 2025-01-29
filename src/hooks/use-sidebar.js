import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { produce } from "immer";

// Hook para gerenciar o estado da barra lateral
export const useSidebar = create(
  persist(
    (set, get) => ({
      isOpen: true,
      isHover: false,
      settings: { disabled: false, isHoverOpen: false },

      toggleOpen: () => set({ isOpen: !get().isOpen }),
      setIsOpen: (isOpen) => set({ isOpen }),
      setIsHover: (isHover) => set({ isHover }),

      // Retorna se a barra lateral deve estar aberta
      getOpenState: () => {
        const { isOpen, isHover, settings } = get();
        return isOpen || (settings.isHoverOpen && isHover);
      },

      // Atualiza as configurações da barra lateral
      setSettings: (settings) =>
        set(
          produce((state) => {
            Object.assign(state.settings, settings);
          })
        ),
    }),
    {
      name: "sidebar", // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

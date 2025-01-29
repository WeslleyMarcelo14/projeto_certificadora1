import { LayoutGrid, ClipboardList, Boxes, Users, Package, Settings } from "lucide-react";

/**
 * Gera a lista de menus do sistema, incluindo menus administrativos quando necessário.
 *
 * @param {boolean} isAdmin - Indica se o usuário tem permissões administrativas (padrão: true).
 * @returns {Array} - Lista estruturada de menus com grupos e itens.
 */
export const getMenuList = (isAdmin = true) =>
  [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Painel",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Gerenciamento",
      menus: [
        { href: "/tarefas", label: "Tarefas", icon: ClipboardList },
        { href: "/estoque", label: "Estoque", icon: Boxes },
      ],
    },
    isAdmin && {
      groupLabel: "Administração",
      menus: [
        { href: "/usuarios", label: "Usuários", icon: Users },
        { href: "/produtos", label: "Produtos", icon: Package },
      ],
    },
    {
      groupLabel: "Configurações",
      menus: [{ href: "/perfil", label: "Perfil", icon: Settings }],
    },
  ].filter(Boolean); // Remove entradas falsas caso `isAdmin` seja falso

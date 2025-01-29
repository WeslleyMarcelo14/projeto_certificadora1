import { LayoutGrid, ClipboardList, Boxes, Users, Package, Settings } from "lucide-react";

export const getMenuList = (isAdmin = 1) =>
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
        {
          href: "/tarefas",
          label: "Tarefas",
          icon: ClipboardList,
        },
        {
          href: "/estoque",
          label: "Estoque",
          icon: Boxes,
        },
      ],
    },
    isAdmin && {
      groupLabel: "Administração",
      menus: [
        {
          href: "/usuarios",
          label: "Usuários",
          icon: Users,
        },
        {
          href: "/produtos",
          label: "Produtos",
          icon: Package,
        },
      ],
    },
    {
      groupLabel: "Configurações",
      menus: [{ href: "/perfil", label: "Perfil", icon: Settings }],
    },
  ].filter(Boolean);

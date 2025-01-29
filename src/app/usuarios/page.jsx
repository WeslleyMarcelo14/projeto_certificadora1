import Link from "next/link";
import ContentLayout from "@/components/dashboard/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const UsuariosPage = () => (
  <ContentLayout title="Usuários">
    {/* Navegação breadcrumb */}
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Início</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Painel</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Usuários</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    {/* Conteúdo sobre usuários */}
    <section className="mt-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
      <p className="text-gray-600 mt-2">Aqui você pode adicionar, editar e remover usuários do sistema, além de definir permissões.</p>
    </section>
  </ContentLayout>
);

export default UsuariosPage;

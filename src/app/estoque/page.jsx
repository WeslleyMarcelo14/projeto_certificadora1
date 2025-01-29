import Link from "next/link";
import ContentLayout from "@/components/dashboard/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const EstoquePage = () => (
  <ContentLayout title="Estoque">
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
          <BreadcrumbPage>Estoque</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    {/* Conteúdo do estoque */}
    <section className="mt-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Gerenciamento de Estoque</h2>
      <p className="text-gray-600 mt-2">Adicione, edite e acompanhe doações e itens disponíveis no estoque.</p>
      {/* Aqui pode entrar uma tabela ou lista de produtos */}
    </section>
  </ContentLayout>
);

export default EstoquePage;

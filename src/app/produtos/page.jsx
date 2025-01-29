import Link from "next/link";
import ContentLayout from "@/components/dashboard/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const ProdutosPage = () => (
  <ContentLayout title="Produtos">
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
          <BreadcrumbPage>Produtos</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    {/* Conteúdo sobre produtos */}
    <section className="mt-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Gerenciamento de Produtos</h2>
      <p className="text-gray-600 mt-2">Aqui você pode adicionar, editar e excluir produtos do sistema.</p>
    </section>
  </ContentLayout>
);

export default ProdutosPage;

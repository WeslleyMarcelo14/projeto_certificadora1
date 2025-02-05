import Link from "next/link";
import ContentLayout from "@/components/dashboard/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Tarefas from "@/components/screens/tarefas";

// Metadata
export const metadata = {
  title: "Painel - Tarefas",
  description: "Gerenciamento de tarefas",
};

const TarefasPage = () => (
  <ContentLayout title="Tarefas">
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
          <BreadcrumbPage>Tarefas</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <section className="mt-6 p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold">Gerenciamento de Tarefas</h2>
      <p className="text-gray-600 mt-2">Aqui você pode criar, editar, excluir e acompanhar suas tarefas.</p>
      <Tarefas />
    </section>
  </ContentLayout>
);

export default TarefasPage;

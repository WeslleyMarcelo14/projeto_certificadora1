"use client";

import Link from "next/link";
import ContentLayout from "@/components/dashboard/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const PainelPage = () => (
  <ContentLayout title="Painel">
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
          <BreadcrumbPage>Painel</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    {/* Seção de boas-vindas */}
    <section className="mt-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Bem-vindo ao Painel</h2>
      <p className="text-gray-600 mt-2">Aqui você pode gerenciar doações, acompanhar o estoque e visualizar relatórios detalhados.</p>
    </section>
  </ContentLayout>
);

export default PainelPage;

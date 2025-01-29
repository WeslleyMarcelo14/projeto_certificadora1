import Navbar from "@/components/dashboard/navbar";

const ContentLayout = ({ title, children }) => (
  <div>
    {/* Barra de navegação com título dinâmico */}
    <Navbar title={title} />

    {/* Container principal para o conteúdo */}
    <section className="container pt-8 pb-8 px-4 sm:px-8">{children}</section>
  </div>
);

export default ContentLayout;

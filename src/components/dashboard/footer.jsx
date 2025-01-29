import Link from "next/link";

const Footer = () => (
  <footer className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="mx-4 md:mx-8 flex h-14 items-center">
      <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
        Desenvolvido para o{" "}
        <Link href="https://www.instagram.com/bonsfluidosutfpr/" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">
          Projeto Bons Fluidos
        </Link>
        . O código-fonte está disponível no{" "}
        <Link href="https://github.com/WeslleyMarcelo14/projeto_certificadora1" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">
          GitHub
        </Link>
        .
      </p>
    </div>
  </footer>
);

export default Footer;

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const PlaceholderContent = () => (
  <Card className="rounded-lg border-none mt-6">
    <CardContent className="p-6">
      {/* Container centralizado */}
      <div className="flex justify-center items-center min-h-[calc(100vh-268px)]">
        <div className="flex flex-col relative">
          {/* Imagem de placeholder */}
          <Image src="/bg.jpg" alt="Placeholder Image" width={500} height={500} priority />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default PlaceholderContent;

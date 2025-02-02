"use client";

import { Card, CardContent } from "@/components/ui/card";

const KpiCard = ({ titulo, valor, descricao, icon: Icon }) => (
  <Card className="w-full">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium">{titulo}</p>
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      <div className="mt-4">
        <h2 className="text-3xl font-bold">{valor}</h2>
        <p className="mt-1 text-xs text-gray-500">{descricao}</p>
      </div>
    </CardContent>
  </Card>
);

export default KpiCard;

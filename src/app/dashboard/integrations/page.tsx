import React from "react";

import { IntegrationsTable } from "@/widgets/integrations-table";

import { Metadata } from "next";



import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Интеграции",
};

export default async function IntegrationsPage() {
  return (
    <div className="flex flex-col items-start py-4">
      <div className="flex justify-between w-full">
        <h1 className="text-xl font-bold mb-8">Интеграции</h1>
        <Button className="w-fit" disabled>
          Создать интеграцию
        </Button>
      </div>
      <div className="flex flex-col gap-y-6 w-full">
        <IntegrationsTable />
      </div>
    </div>
  );
}

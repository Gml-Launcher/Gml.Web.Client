"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { EditIntegrationDialog } from "@/widgets/EditIntegrationDialog";
import { IntegrationsTable } from "@/widgets/integrations-table";

export default function IntegrationsPage() {
  const [isIntegrationEditDialogOpen, setIsIntegrationEditDialogOpen] = useState(false);
  const onIntegrationEditDialogToggle = () => setIsIntegrationEditDialogOpen((prev) => !prev);

  return (
    <div className="flex flex-col items-start py-4">
      <div className="flex justify-between w-full">
        <h1 className="text-xl font-bold mb-8">Интеграции</h1>
        <Button className="w-fit" disabled>
          Создать интеграцию
        </Button>
      </div>

      <div className="flex flex-col gap-y-6 w-full">
        <IntegrationsTable onIntegrationEditDialogToggle={onIntegrationEditDialogToggle} />
        <EditIntegrationDialog
          open={isIntegrationEditDialogOpen}
          onOpenChange={onIntegrationEditDialogToggle}
        />
      </div>
    </div>
  );
}

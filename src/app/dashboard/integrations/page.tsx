"use client";

import React, { useState } from "react";

import { InstallClientForm } from "@/features/install-client-form";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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

      <div className="flex flex-col gap-y-6 w-full mb-12">
        <IntegrationsTable onIntegrationEditDialogToggle={onIntegrationEditDialogToggle} />
        <EditIntegrationDialog
          open={isIntegrationEditDialogOpen}
          onOpenChange={onIntegrationEditDialogToggle}
        />
      </div>

      <div className="flex justify-between w-full">
        <h1 className="text-xl font-bold mb-8">Установка лаунчера</h1>
      </div>

      <div className="flex flex-col gap-y-6 w-full">
        <Card className="w-[700px]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Установка лаунчера</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
            <InstallClientForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useAuthIntegrations } from "@/shared/hooks/useIntegraions";
import { IntegrationsTableSkeleton } from "@/widgets/integrations-table";
import React, { useState } from "react";
import { useColumns } from "@/widgets/integrations-table/lib/columns";
import { RowSelectionState } from "@tanstack/react-table";
import { DataTable } from "@/entities/Table";
import { EditIntegrationDialog } from "@/widgets/EditIntegrationDialog";

export const IntegrationsTable = () => {
  const { data: integrations, isLoading: integrationsLoading } = useAuthIntegrations();

  const [isIntegrationEditDialogOpen, setIsIntegrationEditDialogOpen] = useState(false);
  const onIntegrationEditDialogToggle = () => setIsIntegrationEditDialogOpen((prev) => !prev);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { columns } = useColumns({ onIntegrationEditDialogToggle });

  return (
    <>
      {integrationsLoading && <IntegrationsTableSkeleton />}
      {integrations && (
        <DataTable
          data={integrations.data}
          columns={columns}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}

      <EditIntegrationDialog
        open={isIntegrationEditDialogOpen}
        onOpenChange={onIntegrationEditDialogToggle}
      />
    </>
  );
};

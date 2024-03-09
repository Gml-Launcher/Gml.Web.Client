"use client";

import React, { useState } from "react";

import { RowSelectionState } from "@tanstack/react-table";

import { EditIntegrationDialog } from "@/widgets/EditIntegrationDialog";
import { IntegrationsTableSkeleton } from "@/widgets/integrations-table";

import { DataTable } from "@/entities/Table";


import { useAuthIntegrations } from "@/shared/hooks/useIntegraions";
import { useColumns } from "@/widgets/integrations-table/lib/columns";

export function IntegrationsTable() {
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
}

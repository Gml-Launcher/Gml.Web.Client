'use client';

import React, { useState } from 'react';

import { RowSelectionState } from '@tanstack/react-table';

import { DataTable } from '@/entities/Table';
import { useAuthIntegrations } from '@/shared/hooks/useIntegraions';

import { useColumns } from '../lib/columns';

import { IntegrationsTableSkeleton } from './IntegrationsTableSkeleton';

interface IntegrationsTableProps {
  onIntegrationEditDialogToggle: () => void;
}

export function IntegrationsTable(props: IntegrationsTableProps) {
  const { onIntegrationEditDialogToggle } = props;

  const { data: integrations, isLoading: integrationsLoading } = useAuthIntegrations();

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
    </>
  );
}

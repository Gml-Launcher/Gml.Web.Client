import { Metadata } from "next";
import { Table } from "@/widgets/integrations-table/ui/Table";

export const metadata: Metadata = {
  title: "Интеграции",
};

export default async function IntegrationsPage() {
  return <Table />;
}

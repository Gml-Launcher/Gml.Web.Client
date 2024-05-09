import { Metadata } from "next";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Дашборд",
};

export default async function DashboardPage() {
  return (
    <>
      <Breadcrumbs current={"Главная"} />
      <h3>Дашборд</h3>
    </>
  );
}

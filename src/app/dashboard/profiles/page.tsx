import { Metadata } from "next";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfilesTable } from "@/widgets/profiles-table";
import { CreateProfileForm } from "@/widgets/create-profile-form";

export const metadata: Metadata = {
  title: "Профили",
};

export default async function ProfilesPage() {
  return (
    <div className="flex flex-col items-start py-4">
      <h1 className="text-xl font-bold mb-8">Профили</h1>
      <div className="flex flex-col gap-y-6 w-full">
        <Card className="w-[700px]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Создание профиля</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-6">
            <CreateProfileForm />
          </CardContent>
        </Card>

        <h2 className="text-lg font-semibold">Список профилей</h2>
        <ProfilesTable />
      </div>
    </div>
  );
}

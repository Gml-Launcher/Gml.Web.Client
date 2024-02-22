"use client";

import { DataTable } from "@/entities/Table";
import { useColumns } from "@/widgets/profiles-table/lib/columns";
import { useProfiles } from "@/shared/hooks";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RowSelectionState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { profileService } from "@/shared/services";
import { useToast } from "@/components/ui/use-toast";

interface ProfilesTableProps {}

export const ProfilesTable = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [isProfilesDrawerOpen, setIsProfilesDrawerOpen] = useState(false);
  const onProfilesDrawerToggle = () => setIsProfilesDrawerOpen((prev) => !prev);

  const [isProfileDeleteModalOpen, setIsProfileDeleteModalOpen] = useState(false);
  const onProfileDeleteModalToggle = () => setIsProfileDeleteModalOpen((prev) => !prev);

  const { toast } = useToast();
  const { data, isLoading } = useProfiles();
  const { columns } = useColumns({ onProfileDeleteModalToggle });

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-profile"],
    mutationFn: () =>
      profileService.deleteProfile({
        profileName: "frontend",
      }),
    onSuccess: async (data) => {
      toast({
        title: "Успешно",
        description: data.message,
      });
      await profileService.getProfiles();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: "Ошибка!",
          description: error.response && error.response.data.message,
        });
      }
    },
  });

  return (
    <>
      {data && (
        <DataTable
          columns={columns}
          data={data}
          onOpenChange={onProfilesDrawerToggle}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}

      <Sheet open={isProfilesDrawerOpen} onOpenChange={onProfilesDrawerToggle}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Групповое действие над профилями</SheetTitle>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Удаление профилей</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-y-4">
                <CardDescription>
                  Вы моежете безвозвратно удалить профили, если они вам не нужны
                </CardDescription>
                <CardDescription>
                  Безвозвратно будут удалены: {Object.keys(rowSelection).join(", ")}
                </CardDescription>
                <Button variant="destructive" className="w-fit">
                  Удалить профили
                </Button>
              </CardContent>
            </Card>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isProfileDeleteModalOpen} onOpenChange={onProfileDeleteModalToggle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удаление профиля</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены что хотите безвозвратно удалить профиль?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onProfileDeleteModalToggle}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutate()}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

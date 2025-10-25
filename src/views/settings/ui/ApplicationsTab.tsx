'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MoreVertical, Plus, Trash, Copy, CheckCircle } from 'lucide-react';

import {
  useApplications,
  useCreateApplication,
  useDeleteApplication,
} from '@/features/applications';
import { ExternalApplicationCreateDto, ExternalApplicationReadDto } from '@/shared/api/contracts';
import { rbacApi, PermissionDto } from '@/shared/api/rbac';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Icons } from '@/shared/ui/icons';
import { MultiSelect } from '@/shared/ui/multi-select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

export const ApplicationsTab: React.FC = () => {
  // Fetch applications data
  const { data: applications = [], isLoading: isLoadingApplications, error } = useApplications();

  // Create application mutation
  const { mutateAsync: createApplication, isPending: isCreating } = useCreateApplication();

  // Delete application mutation
  const { mutateAsync: deleteApplication, isPending: isDeleting } = useDeleteApplication();

  // State for permissions
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [createdApplication, setCreatedApplication] = useState<ExternalApplicationReadDto | null>(
    null,
  );
  const [applicationToDelete, setApplicationToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [newApplication, setNewApplication] = useState<ExternalApplicationCreateDto>({
    name: '',
    permissionIds: [],
  });

  // Fetch permissions when component mounts
  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoadingPermissions(true);
      try {
        const perms = await rbacApi.getPermissions();
        setPermissions(perms);
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, []);

  // Group permissions by their prefix (before the dot in the permission name)
  const permsByGroup = useMemo(() => {
    const map = new Map<string, PermissionDto[]>();
    for (const p of permissions) {
      const name = p.name ?? '';
      const group = name.includes('.') ? name.split('.')[0] : 'other';
      const list = map.get(group) ?? [];
      list.push(p);
      map.set(group, list);
    }
    // sort groups alphabetically, and items within group by name
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([g, list]) => [g, list.sort((x, y) => (x.name ?? '').localeCompare(y.name ?? ''))]) as [
      string,
      PermissionDto[],
    ][];
  }, [permissions]);

  // Convert permissions to format expected by MultiSelect with groups
  const permissionOptions = useMemo(() => {
    return permsByGroup.flatMap(([group, perms]) => [
      // Group header - using a custom component would be better, but we'll use a special label format
      {
        label: `▼ ${group.toUpperCase()} - Группа прав`,
        value: `group-${group}`,
        icon: undefined,
      },
      // Individual permissions with descriptions and indentation
      ...perms.map((perm) => ({
        label: perm.description ? `  • ${perm.name} - ${perm.description}` : `  • ${perm.name}`,
        value: perm.id.toString(),
        icon: undefined,
      })),
    ]);
  }, [permsByGroup]);

  // Handle permission selection changes
  const handlePermissionChange = (selectedValues: string[]) => {
    // Filter out group headers (values starting with "group-")
    const filteredValues = selectedValues.filter((val) => !val.startsWith('group-'));

    // Convert string IDs back to numbers
    const permissionIds = filteredValues.map((val) => parseInt(val, 10)).filter((id) => !isNaN(id)); // Filter out any NaN values

    setNewApplication((prev) => ({ ...prev, permissionIds }));
  };

  const handleCreateApplication = async () => {
    const createdApp = await createApplication(newApplication);
    setCreatedApplication(createdApp);
    setNewApplication({ name: '', permissionIds: [] });
    setCreateModalOpen(false);
    setSuccessDialogOpen(true);
  };

  const handleDeleteApplication = async () => {
    if (!applicationToDelete) return;

    await deleteApplication(applicationToDelete.id);
    setApplicationToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Внешние приложения</h2>
        <Button
          onClick={() => {
            setNewApplication({ name: '', permissionIds: [] });
            setCreateModalOpen(true);
          }}
          disabled={isLoadingApplications}
        >
          <Plus className="mr-2 h-4 w-4" />
          Создать приложение
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[80px]">ID</TableHead>
              <TableHead className="min-w-[200px]">Название</TableHead>
              <TableHead>Права</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead className="w-[1%] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingApplications ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Icons.spinner className="mx-auto h-6 w-6 animate-spin" />
                  <span className="mt-2 block">Загрузка приложений...</span>
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Нет созданных приложений
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.id.substring(0, 8)}...</TableCell>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>
                    {app.permissions.length > 0 ? (
                      <div className="space-y-2">
                        {/* Group permissions by prefix */}
                        {(() => {
                          // Group permissions by prefix
                          const groupedPerms = new Map<string, PermissionDto[]>();
                          for (const p of app.permissions) {
                            const name = p.name ?? '';
                            const group = name.includes('.') ? name.split('.')[0] : 'other';
                            const list = groupedPerms.get(group) ?? [];
                            list.push(p);
                            groupedPerms.set(group, list);
                          }

                          // Sort groups and permissions within groups
                          return Array.from(groupedPerms.entries())
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([group, perms]) => (
                              <div key={group} className="space-y-1">
                                <div className="font-semibold text-xs bg-accent/40 p-1 rounded-sm">
                                  {group.toUpperCase()}
                                </div>
                                <ul className="list-disc list-inside text-xs pl-2 space-y-1">
                                  {perms
                                    .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
                                    .map((p) => (
                                      <li key={p.id} className="leading-tight">
                                        <span className="font-medium">{p.name}</span>
                                        {p.description && (
                                          <span className="text-muted-foreground text-[10px] block pl-4">
                                            {' '}
                                            {p.description}
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ));
                        })()}
                      </div>
                    ) : (
                      'Нет прав'
                    )}
                  </TableCell>
                  <TableCell>{new Date(app.createdAtUtc).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={isDeleting}
                        >
                          <span className="sr-only">Открыть меню</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setApplicationToDelete({ id: app.id, name: app.name });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Application Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создать новое приложение</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название приложения</Label>
              <Input
                id="name"
                value={newApplication.name}
                onChange={(e) => setNewApplication({ ...newApplication, name: e.target.value })}
                placeholder="Введите название приложения"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="permissions">Права доступа</Label>
              <MultiSelect
                options={permissionOptions}
                onValueChange={handlePermissionChange}
                defaultValue={[]}
                placeholder="Выберите права доступа"
                variant="inverted"
                maxCount={5}
              />
              {isLoadingPermissions && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка прав доступа...
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
              disabled={isCreating}
            >
              Отмена
            </Button>
            <Button
              onClick={handleCreateApplication}
              disabled={!newApplication.name.trim() || isCreating}
            >
              {isCreating && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить приложение</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить приложение &quot;{applicationToDelete?.name}&quot;? Это действие
              нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteApplication}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Успех
            </DialogTitle>
            <DialogDescription>
              Приложение &quot;{createdApplication?.name}&quot; успешно создано
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="token" className="mb-2 block">
              Токен приложения:
            </Label>
            <div className="relative">
              <div className="flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm">
                <code className="font-mono text-xs break-all">{createdApplication?.token}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-0 flex-shrink-0"
                  onClick={() => {
                    if (createdApplication?.token) {
                      navigator.clipboard.writeText(createdApplication.token);
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Копировать токен</span>
                </Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Сохраните этот токен в надежном месте. Он будет показан только один раз.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setSuccessDialogOpen(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

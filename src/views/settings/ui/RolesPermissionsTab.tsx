'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { PermissionDto, rbacApi, RbacUser, RoleDto, RoleWithPerms } from '@/shared/api/rbac';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Badge } from '@/shared/ui/badge';
import { Checkbox } from '@/shared/ui/checkbox';

const emptyRole: Omit<RoleDto, 'id'> = { name: '', description: '' };
const emptyPerm: Omit<PermissionDto, 'id'> = { name: '', description: '' };

export const RolesPermissionsTab: React.FC = () => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [perms, setPerms] = useState<PermissionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingRole, setEditingRole] = useState<RoleDto | null>(null);
  const [roleForm, setRoleForm] = useState<Omit<RoleDto, 'id'>>(emptyRole);

  const [editingPerm, setEditingPerm] = useState<PermissionDto | null>(null);
  const [permForm, setPermForm] = useState<Omit<PermissionDto, 'id'>>(emptyPerm);

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [permToAssign, setPermToAssign] = useState<number | ''>('');

  const [userId, setUserId] = useState<string>('');
  const [roleToAssign, setRoleToAssign] = useState<number | ''>('');

  const [rolesDetails, setRolesDetails] = useState<RoleWithPerms[]>([]);
  const [users, setUsers] = useState<RbacUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) || null,
    [roles, selectedRoleId],
  );
  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId],
  );
  const selectUser = (u: RbacUser) => {
    setSelectedUserId(u.id);
    setUserId(String(u.id));
  };

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r, p, rd, u] = await Promise.all([
        rbacApi.getRoles(),
        rbacApi.getPermissions(),
        rbacApi.getRolesDetails(),
        rbacApi.getUsersRbac(),
      ]);
      setRoles(r);
      setPerms(p);
      setRolesDetails(rd);
      setUsers(u);
      if (!selectedRoleId && r.length) setSelectedRoleId(r[0].id);
      if (!selectedUserId && u?.length) setSelectedUserId(u[0].id);
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitRole = async () => {
    if (!roleForm.name?.trim()) return;
    setLoading(true);
    try {
      if (editingRole) {
        const updated = await rbacApi.updateRole(editingRole.id, roleForm);
        setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? updated : r)));
        setEditingRole(null);
      } else {
        const created = await rbacApi.createRole(roleForm);
        setRoles((prev) => [created, ...prev]);
        if (!selectedRoleId) setSelectedRoleId(created.id);
      }
      setRoleForm(emptyRole);
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка сохранения роли');
    } finally {
      setLoading(false);
    }
  };

  const submitPerm = async () => {
    if (!permForm.name?.trim()) return;
    setLoading(true);
    try {
      if (editingPerm) {
        const updated = await rbacApi.updatePermission(editingPerm.id, permForm);
        setPerms((prev) => prev.map((p) => (p.id === editingPerm.id ? updated : p)));
        setEditingPerm(null);
      } else {
        const created = await rbacApi.createPermission(permForm);
        setPerms((prev) => [created, ...prev]);
      }
      setPermForm(emptyPerm);
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка сохранения права');
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: number) => {
    setLoading(true);
    try {
      await rbacApi.deleteRole(id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
      if (selectedRoleId === id) setSelectedRoleId(null);
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка удаления роли');
    } finally {
      setLoading(false);
    }
  };

  const deletePerm = async (id: number) => {
    setLoading(true);
    try {
      await rbacApi.deletePermission(id);
      setPerms((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка удаления права');
    } finally {
      setLoading(false);
    }
  };

  const refreshRolesDetails = async () => {
    try {
      const rd = await rbacApi.getRolesDetails();
      setRolesDetails(rd);
    } catch {}
  };
  const refreshUsers = async () => {
    try {
      const u = await rbacApi.getUsersRbac();
      setUsers(u);
      if (!selectedUserId && u?.length) setSelectedUserId(u[0].id);
    } catch {}
  };

  const hasRolePerm = (roleId: number, permId: number) => {
    const role = rolesDetails.find((r) => r.id === roleId);
    if (!role?.permissions) return false;
    return role.permissions.some((p) => p.id === permId);
  };

  const toggleRolePerm = async (roleId: number, permId: number, checked: boolean) => {
    setLoading(true);
    try {
      if (checked) {
        await rbacApi.assignPermToRole(roleId, permId);
      } else {
        await rbacApi.removePermFromRole(roleId, permId);
      }
      await refreshRolesDetails();
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка обновления прав роли');
    } finally {
      setLoading(false);
    }
  };

  const assignPerm = async () => {
    if (!selectedRoleId || !permToAssign) return;
    setLoading(true);
    try {
      await rbacApi.assignPermToRole(selectedRoleId, Number(permToAssign));
      await refreshRolesDetails();
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка назначения права роли');
    } finally {
      setLoading(false);
    }
  };

  const removePerm = async () => {
    if (!selectedRoleId || !permToAssign) return;
    setLoading(true);
    try {
      await rbacApi.removePermFromRole(selectedRoleId, Number(permToAssign));
      await refreshRolesDetails();
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка снятия права с роли');
    } finally {
      setLoading(false);
    }
  };

  const assignRoleUser = async () => {
    const uid = Number(userId);
    if (!uid || !roleToAssign) return;
    setLoading(true);
    try {
      await rbacApi.assignRoleToUser(uid, Number(roleToAssign));
      await refreshUsers();
      if (!selectedUserId) setSelectedUserId(uid);
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка назначения роли пользователю');
    } finally {
      setLoading(false);
    }
  };

  const removeRoleUser = async () => {
    const uid = Number(userId);
    if (!uid || !roleToAssign) return;
    setLoading(true);
    try {
      await rbacApi.removeRoleFromUser(uid, Number(roleToAssign));
      await refreshUsers();
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка снятия роли с пользователя');
    } finally {
      setLoading(false);
    }
  };

  const permsByGroup = useMemo(() => {
    const map = new Map<string, PermissionDto[]>();
    for (const p of perms) {
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
  }, [perms]);

  const rolesReversed = useMemo(() => [...roles], [roles]);

  return (
    <div className="grid gap-6">
      {error && (
        <div className="text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
      <Tabs defaultValue="users" className="grid gap-4">
        <TabsList className="justify-start w-full overflow-x-auto">
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="roles">Роли</TabsTrigger>
          <TabsTrigger value="matrix">Матрица</TabsTrigger>
          <TabsTrigger value="perms">Права</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Пользователи</h2>
            <Button variant="outline" size="sm" onClick={refreshUsers} disabled={loading}>
              Обновить
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[200px]">Логин/Email</TableHead>
                  <TableHead>Роли пользователя</TableHead>
                  <TableHead>Права</TableHead>
                  <TableHead className="w-[1%] text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow
                    key={u.id}
                    data-state={selectedUserId === u.id ? 'selected' : undefined}
                  >
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.login ?? u.email ?? '-'}</TableCell>
                    <TableCell className="text-xs">
                      {u.roles?.map((r) => r.name).join(', ') || '-'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {u.permissions?.map((p) => p.name).join(', ') || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(u.id);
                              setUserId(String(u.id));
                            }}
                          >
                            Настроить
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="p-3 w-[340px] grid gap-3">
                          <div className="grid gap-2">
                            <div className="text-xs uppercase text-muted-foreground">Роли</div>
                            <div className="flex flex-wrap gap-2">
                              {roles.map((r) => {
                                const active = u.roles?.some((ur) => ur.id === r.id);
                                return (
                                  <Badge
                                    key={r.id}
                                    className={`cursor-pointer select-none ${active ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-foreground hover:bg-muted/80'}`}
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setSelectedUserId(u.id);
                                      try {
                                        if (active) {
                                          await rbacApi.removeRoleFromUser(u.id, r.id);
                                        } else {
                                          await rbacApi.assignRoleToUser(u.id, r.id);
                                        }
                                        await refreshUsers();
                                      } catch (err: any) {
                                        setError(
                                          err?.message ?? 'Ошибка обновления ролей пользователя',
                                        );
                                      }
                                    }}
                                  >
                                    {r.name}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {!users.length && (
                  <TableRow>
                    <TableCell className="text-muted-foreground" colSpan={5}>
                      Нет пользователей
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Матрица прав</h2>
            <Button variant="outline" size="sm" onClick={refreshRolesDetails} disabled={loading}>
              Обновить
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">Право</TableHead>
                  {rolesReversed.map((r) => (
                    <TableHead key={r.id} title={r.description ?? ''}>
                      {r.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permsByGroup.map(([group, list]) => (
                  <React.Fragment key={group}>
                    <TableRow>
                      <TableCell colSpan={1 + roles.length} className="bg-muted/40 font-medium">
                        {group}
                      </TableCell>
                    </TableRow>
                    {list.map((p) => (
                      <TableRow key={p.id} className="cursor-default">
                        <TableCell title={p.description ?? ''}>
                          <div className="font-medium">{p.name}</div>
                          {p.description && (
                            <div className="text-xs text-muted-foreground">{p.description}</div>
                          )}
                        </TableCell>
                        {rolesReversed.map((r) => (
                          <TableCell key={r.id}>
                            <Checkbox
                              checked={hasRolePerm(r.id, p.id)}
                              onCheckedChange={(v: any) => toggleRolePerm(r.id, p.id, !!v)}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
                {!perms.length && (
                  <TableRow>
                    <TableCell className="text-muted-foreground" colSpan={1 + roles.length}>
                      Нет прав
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="grid gap-3">
          <h2 className="text-xl font-semibold">Роли (CRUD)</h2>
          <div className="flex gap-2 items-end flex-wrap">
            <div className="grid gap-2">
              <Label htmlFor="role-name">Название</Label>
              <Input
                id="role-name"
                placeholder="Название роли"
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role-desc">Описание</Label>
              <Input
                id="role-desc"
                placeholder="Описание роли"
                value={roleForm.description ?? ''}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
              />
            </div>
            <Button onClick={submitRole} disabled={loading}>
              {editingRole ? 'Сохранить' : 'Создать'}
            </Button>
            {editingRole && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingRole(null);
                  setRoleForm(emptyRole);
                }}
              >
                Отмена
              </Button>
            )}
          </div>
          <div className="grid gap-2">
            {roles.map((r) => (
              <div key={r.id} className="flex items-center justify-between border rounded-md p-2">
                <div>
                  <div className="font-medium">{r.name}</div>
                  {r.description && (
                    <div className="text-sm text-muted-foreground">{r.description}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingRole(r);
                      setRoleForm({ name: r.name, description: r.description ?? '' });
                    }}
                  >
                    Редактировать
                  </Button>
                  <Button variant="destructive" onClick={() => deleteRole(r.id)}>
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
            {!roles.length && <div className="text-sm text-muted-foreground">Ролей пока нет.</div>}
          </div>
        </TabsContent>

        <TabsContent value="perms" className="grid gap-3">
          <h2 className="text-xl font-semibold">Права (CRUD)</h2>
          <div className="flex gap-2 items-end flex-wrap">
            <div className="grid gap-2">
              <Label htmlFor="perm-name">Название</Label>
              <Input
                id="perm-name"
                placeholder="Название права"
                value={permForm.name}
                onChange={(e) => setPermForm({ ...permForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="perm-desc">Описание</Label>
              <Input
                id="perm-desc"
                placeholder="Описание права"
                value={permForm.description ?? ''}
                onChange={(e) => setPermForm({ ...permForm, description: e.target.value })}
              />
            </div>
            <Button onClick={submitPerm} disabled={loading}>
              {editingPerm ? 'Сохранить' : 'Создать'}
            </Button>
            {editingPerm && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingPerm(null);
                  setPermForm(emptyPerm);
                }}
              >
                Отмена
              </Button>
            )}
          </div>
          <div className="grid gap-2">
            {perms.map((p) => (
              <div key={p.id} className="flex items-center justify-between border rounded-md p-2">
                <div>
                  <div className="font-medium">{p.name}</div>
                  {p.description && (
                    <div className="text-sm text-muted-foreground">{p.description}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingPerm(p);
                      setPermForm({ name: p.name, description: p.description ?? '' });
                    }}
                  >
                    Редактировать
                  </Button>
                  <Button variant="destructive" onClick={() => deletePerm(p.id)}>
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
            {!perms.length && <div className="text-sm text-muted-foreground">Прав пока нет.</div>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

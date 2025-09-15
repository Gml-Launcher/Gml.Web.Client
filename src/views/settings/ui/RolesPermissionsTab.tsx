'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MoreVertical, Pencil, RefreshCw, Trash } from 'lucide-react';

import { PermissionDto, rbacApi, RbacUser, RoleDto, RoleWithPerms } from '@/shared/api/rbac';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Badge } from '@/shared/ui/badge';
import { Checkbox } from '@/shared/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

const emptyRole: Omit<RoleDto, 'id'> = { name: '', description: '' };
const emptyPerm: Omit<PermissionDto, 'id'> = { name: '', description: '' };

export const RolesPermissionsTab: React.FC = () => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [perms, setPerms] = useState<PermissionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingRole, setEditingRole] = useState<RoleDto | null>(null);
  const [roleForm, setRoleForm] = useState<Omit<RoleDto, 'id'>>(emptyRole);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleDto | null>(null);

  const [editingPerm, setEditingPerm] = useState<PermissionDto | null>(null);
  const [permForm, setPermForm] = useState<Omit<PermissionDto, 'id'>>(emptyPerm);
  const [permModalOpen, setPermModalOpen] = useState(false);

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [permToAssign, setPermToAssign] = useState<number | ''>('');

  const [userId, setUserId] = useState<string>('');
  const [roleToAssign, setRoleToAssign] = useState<number | ''>('');

  const [rolesDetails, setRolesDetails] = useState<RoleWithPerms[]>([]);
  const [users, setUsers] = useState<RbacUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [deleteUserTarget, setDeleteUserTarget] = useState<RbacUser | null>(null);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<{ login: string; password: string; email?: string }>({
    login: '',
    password: '',
    email: '',
  });
  const [newUserRole, setNewUserRole] = useState<string>('');
  const [userErrors, setUserErrors] = useState<{
    login?: string;
    password?: string;
    email?: string;
  }>({});

  const validateUser = (u: { login: string; password: string; email?: string }) => {
    const errs: { login?: string; password?: string; email?: string } = {};

    // Login
    const login = (u.login ?? '').trim();
    if (!login) {
      errs.login = 'Пожалуйста, укажите login.';
    } else if (login.length < 3 || login.length > 50) {
      errs.login = 'Login должен быть от 3 до 50 символов.';
    } else if (!/^[a-zA-Z0-9]*$/.test(login)) {
      errs.login = 'Login должен состоять только из букв и цифр.';
    }

    // Password
    const pwd = u.password ?? '';
    if (!pwd) {
      errs.password = 'Пожалуйста, укажите пароль.';
    } else if (pwd.length < 5 || pwd.length > 100) {
      errs.password = 'Пароль должен быть от 5 до 100 символов.';
    } else {
      if (!/[A-Z]/.test(pwd))
        errs.password = 'Пароль должен содержать хотя бы одну заглавную букву.';
      else if (!/[a-z]/.test(pwd))
        errs.password = 'Пароль должен содержать хотя бы одну строчную букву.';
      else if (!/[0-9]/.test(pwd)) errs.password = 'Пароль должен содержать хотя бы одну цифру.';
    }

    // Email
    const email = (u.email ?? '').trim();
    if (!email) {
      errs.email = 'Пожалуйста, укажите адрес электронной почты.';
    } else {
      // Basic email check
      const emailRegex = /^(?:[\w!#$%&'*+/=?`{|}~^.-]+)@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        errs.email = 'Пожалуйста, укажите действующий адрес электронной почты.';
      }
    }

    return errs;
  };

  const isUserFormValid = (u: { login: string; password: string; email?: string }) => {
    const errs = validateUser(u);
    return !errs.login && !errs.password && !errs.email;
  };

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
      setRoleModalOpen(false);
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
      setPermModalOpen(false);
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

  const deleteUser = async (id: number) => {
    setLoading(true);
    try {
      await rbacApi.deleteUser(id);
      await refreshUsers();
      if (selectedUserId === id) setSelectedUserId(null);
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка удаления пользователя');
    } finally {
      setLoading(false);
    }
  };

  const submitUser = async () => {
    const errs = validateUser(newUser);
    setUserErrors(errs);
    if (errs.login || errs.password || errs.email) return;
    setLoading(true);
    try {
      await rbacApi.createUser(
        {
          login: newUser.login.trim(),
          password: newUser.password,
          email: newUser.email?.trim() || undefined,
        },
        newUserRole?.trim() || undefined,
      );
      setUserModalOpen(false);
      setNewUser({ login: '', password: '', email: '' });
      setNewUserRole('');
      setUserErrors({});
      await refreshUsers();
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка создания пользователя');
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

  const roleHasAllGroupPerms = (roleId: number, groupPerms: PermissionDto[]) => {
    return groupPerms.every((p) => hasRolePerm(roleId, p.id));
  };
  const roleHasSomeGroupPerms = (roleId: number, groupPerms: PermissionDto[]) => {
    return groupPerms.some((p) => hasRolePerm(roleId, p.id));
  };
  const toggleRoleGroup = async (roleId: number, groupPerms: PermissionDto[], checked: boolean) => {
    setLoading(true);
    try {
      const ops: Promise<any>[] = [];
      if (checked) {
        for (const p of groupPerms) {
          if (!hasRolePerm(roleId, p.id)) {
            ops.push(rbacApi.assignPermToRole(roleId, p.id));
          }
        }
      } else {
        for (const p of groupPerms) {
          if (hasRolePerm(roleId, p.id)) {
            ops.push(rbacApi.removePermFromRole(roleId, p.id));
          }
        }
      }
      if (ops.length) {
        await Promise.all(ops);
      }
      await refreshRolesDetails();
    } catch (e: any) {
      setError(e?.message ?? 'Ошибка обновления группы прав');
    } finally {
      setLoading(false);
    }
  };
  const rolesReversed = useMemo(() => [...roles], [roles]);

  const isAdminRole = (r: { name?: string | null }) => (r.name ?? '').toLowerCase() === 'admin';
  const isSystemPerm = (p: Partial<PermissionDto> | undefined | null) => !!(p as any)?.isSystem;

  const RoleWithPermsHover: React.FC<{
    roleId: number;
    roleName?: string | null;
    rolesDetails: RoleWithPerms[];
  }> = ({ roleId, roleName, rolesDetails }) => {
    const rd = rolesDetails.find((r) => r.id === roleId);
    const perms = rd?.permissions ?? [];
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="cursor-default select-none">{roleName || '—'}</Badge>
        </TooltipTrigger>
        <TooltipContent className="w-80 text-xs">
          <div className="grid gap-2">
            <div className="font-medium">Права роли: {roleName}</div>
            {perms.length ? (
              <ul className="list-disc list-inside space-y-1 max-h-52 overflow-auto">
                {perms.map((p) => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground">Нет прав</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="users">
        <TabsList className="justify-start w-full overflow-x-auto">
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="roles">Роли</TabsTrigger>
          <TabsTrigger value="perms">Права</TabsTrigger>
          <TabsTrigger value="matrix">Матрица</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Пользователи</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshUsers} disabled={loading}>
                Обновить
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setNewUser({ login: '', password: '', email: '' });
                  setUserErrors({});
                  // Preselect first available role by name; if none, keep empty to default Admin on backend
                  setNewUserRole(roles[0]?.name ?? '');
                  setUserModalOpen(true);
                }}
                disabled={loading}
              >
                Создать пользователя
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[200px]">Логин/Email</TableHead>
                  <TableHead>Роли пользователя</TableHead>
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
                      {u.roles?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {u.roles.map((r) => (
                            <RoleWithPermsHover
                              key={r.id}
                              roleId={r.id}
                              roleName={r.name}
                              rolesDetails={rolesDetails}
                            />
                          ))}
                        </div>
                      ) : (
                        '-'
                      )}
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
                            <div className="text-xs uppercase text-muted-foreground">Действия</div>
                            <div className="flex items-center justify-between">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedUserId(u.id);
                                  setUserId(String(u.id));
                                  setDeleteUserTarget(u);
                                  setDeleteUserOpen(true);
                                }}
                              >
                                <Trash size={14} className="mr-2" /> Удалить пользователя
                              </Button>
                            </div>
                          </div>
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
                    <TableCell className="text-muted-foreground" colSpan={4}>
                      Нет пользователей
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog open={deleteUserOpen} onOpenChange={setDeleteUserOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подтверждение удаления пользователя</DialogTitle>
              </DialogHeader>
              <div className="py-2">
                Вы уверены, что хотите удалить пользователя «
                {deleteUserTarget?.login ?? deleteUserTarget?.email ?? deleteUserTarget?.id}»?
              </div>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDeleteUserOpen(false);
                    setDeleteUserTarget(null);
                  }}
                  disabled={loading}
                >
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (deleteUserTarget) {
                      deleteUser(deleteUserTarget.id);
                    }
                    setDeleteUserOpen(false);
                    setDeleteUserTarget(null);
                  }}
                  disabled={loading}
                >
                  Удалить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать пользователя</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="user-login">Логин</Label>
                  <Input
                    id="user-login"
                    placeholder="Логин"
                    value={newUser.login}
                    onChange={(e) => {
                      const next = { ...newUser, login: e.target.value };
                      setNewUser(next);
                      setUserErrors(validateUser(next));
                    }}
                  />
                  {userErrors.login && (
                    <div className="text-xs text-destructive mt-1">{userErrors.login}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-password">Пароль</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="Пароль"
                    value={newUser.password}
                    onChange={(e) => {
                      const next = { ...newUser, password: e.target.value };
                      setNewUser(next);
                      setUserErrors(validateUser(next));
                    }}
                  />
                  {userErrors.password && (
                    <div className="text-xs text-destructive mt-1">{userErrors.password}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="email@example.com"
                    value={newUser.email ?? ''}
                    onChange={(e) => {
                      const next = { ...newUser, email: e.target.value };
                      setNewUser(next);
                      setUserErrors(validateUser(next));
                    }}
                  />
                  {userErrors.email && (
                    <div className="text-xs text-destructive mt-1">{userErrors.email}</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-role">Роль</Label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger id="user-role">
                      <SelectValue placeholder="Выберите роль (по умолчанию Admin)" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.name}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setUserModalOpen(false);
                    setNewUser({ login: '', password: '', email: '' });
                    setNewUserRole('');
                    setUserErrors({});
                  }}
                  disabled={loading}
                >
                  Отмена
                </Button>
                <Button onClick={submitUser} disabled={loading || !isUserFormValid(newUser)}>
                  Создать
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                    <TableRow className="bg-accent/40 border-l-4 border-l-primary">
                      <TableCell className="font-medium">
                        <div>{group}</div>
                        <div className="text-xs text-muted-foreground">Все из группы</div>
                      </TableCell>
                      {rolesReversed.map((r) => (
                        <TableCell key={r.id}>
                          <Checkbox
                            checked={roleHasAllGroupPerms(r.id, list)}
                            disabled={isAdminRole(r)}
                            className={isAdminRole(r) ? 'opacity-50 pointer-events-none' : ''}
                            onCheckedChange={(v: any) => {
                              if (isAdminRole(r)) return;
                              toggleRoleGroup(r.id, list, !!v);
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                    {list.map((p) => (
                      <TableRow key={p.id} className={`cursor-default`}>
                        <TableCell title={p.description ?? ''}>
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{p.name}</div>
                            {isSystemPerm(p) && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="destructive" className="h-5 px-1 text-[10px]">
                                    SYSTEM
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Системное право. Изменение запрещено.
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          {p.description && (
                            <div className="text-xs text-muted-foreground">{p.description}</div>
                          )}
                        </TableCell>
                        {rolesReversed.map((r) => (
                          <TableCell key={r.id}>
                            <Checkbox
                              checked={hasRolePerm(r.id, p.id)}
                              disabled={isAdminRole(r)}
                              className={isAdminRole(r) ? 'opacity-50 pointer-events-none' : ''}
                              onCheckedChange={(v: any) => {
                                if (isAdminRole(r)) return;
                                toggleRolePerm(r.id, p.id, !!v);
                              }}
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
          <h2 className="text-xl font-semibold">Роли</h2>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-muted-foreground">Управление ролями</div>
            <Button
              onClick={() => {
                setEditingRole(null);
                setRoleForm(emptyRole);
                setRoleModalOpen(true);
              }}
              disabled={loading}
            >
              Создать роль
            </Button>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
                      aria-label="Действия"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className={isAdminRole(r) ? 'opacity-50 pointer-events-none' : ''}
                      onClick={() => {
                        if (isAdminRole(r)) return;
                        setEditingRole(r);
                        setRoleForm({ name: r.name, description: r.description ?? '' });
                        setRoleModalOpen(true);
                      }}
                    >
                      <Pencil size={14} className="mr-2" /> Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={isAdminRole(r) ? 'opacity-50 pointer-events-none' : ''}
                      onClick={() => {
                        if (isAdminRole(r)) return;
                        setRoleToDelete(r);
                        setConfirmOpen(true);
                      }}
                    >
                      <Trash size={14} className="mr-2" /> Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            {!roles.length && <div className="text-sm text-muted-foreground">Ролей пока нет.</div>}
          </div>

          <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRole ? 'Редактировать роль' : 'Создать роль'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
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
              </div>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setRoleModalOpen(false);
                    setEditingRole(null);
                    setRoleForm(emptyRole);
                  }}
                  disabled={loading}
                >
                  Отмена
                </Button>
                <Button onClick={submitRole} disabled={loading || !roleForm.name?.trim()}>
                  {editingRole ? 'Сохранить' : 'Создать'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подтверждение удаления</DialogTitle>
              </DialogHeader>
              <div className="py-2">
                Вы уверены, что хотите удалить роль «{roleToDelete?.name}»?
              </div>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setConfirmOpen(false);
                    setRoleToDelete(null);
                  }}
                >
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (roleToDelete) {
                      deleteRole(roleToDelete.id);
                    }
                    setConfirmOpen(false);
                    setRoleToDelete(null);
                  }}
                >
                  Удалить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="perms" className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Права</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadAll} disabled={loading}>
                <RefreshCw size={14} className="mr-2" /> Обновить
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setEditingPerm(null);
                  setPermForm(emptyPerm);
                  setPermModalOpen(true);
                }}
                disabled={loading}
              >
                Создать право
              </Button>
            </div>
          </div>

          {/* Groups */}
          <div className="grid gap-3">
            {permsByGroup.map(([group, list]) => (
              <div key={group} className="rounded-md border">
                <div className="px-3 py-2 bg-accent/40 border-b flex items-center justify-between">
                  <div className="font-medium">
                    {group}
                    <span className="text-xs text-muted-foreground ml-2">{list.length}</span>
                  </div>
                </div>
                <div className="p-2 grid gap-2">
                  {list.map((p) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between border rounded-md p-2 ${isSystemPerm(p) ? 'border-l-4 border-l-red-500' : ''}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{p.name}</div>
                          {isSystemPerm(p) && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="destructive" className="h-5 px-1 text-[10px]">
                                  SYSTEM
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>Системное право. Изменение запрещено.</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        {p.description && (
                          <div className="text-sm text-muted-foreground">{p.description}</div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
                            aria-label="Действия"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className={isSystemPerm(p) ? 'opacity-50 pointer-events-none' : ''}
                            onClick={() => {
                              if (isSystemPerm(p)) return;
                              setEditingPerm(p);
                              setPermForm({ name: p.name, description: p.description ?? '' });
                              setPermModalOpen(true);
                            }}
                          >
                            <Pencil size={14} className="mr-2" /> Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={isSystemPerm(p) ? 'opacity-50 pointer-events-none' : ''}
                            onClick={() => {
                              if (!isSystemPerm(p)) deletePerm(p.id);
                            }}
                          >
                            <Trash size={14} className="mr-2" /> Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                  {!list.length && (
                    <div className="text-sm text-muted-foreground px-2 py-1">
                      Нет прав в группе.
                    </div>
                  )}
                </div>
              </div>
            ))}
            {!perms.length && <div className="text-sm text-muted-foreground">Прав пока нет.</div>}
          </div>

          {/* Create/Edit Permission Modal */}
          <Dialog open={permModalOpen} onOpenChange={setPermModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingPerm ? 'Редактировать право' : 'Создать право'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
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
              </div>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPermModalOpen(false);
                    setEditingPerm(null);
                    setPermForm(emptyPerm);
                  }}
                  disabled={loading}
                >
                  Отмена
                </Button>
                <Button
                  onClick={async () => {
                    await submitPerm();
                    if (!editingPerm) await loadAll();
                    setPermModalOpen(false);
                  }}
                  disabled={loading || !permForm.name?.trim()}
                >
                  {editingPerm ? 'Сохранить' : 'Создать'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

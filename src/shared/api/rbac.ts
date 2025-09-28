import { $api } from '@/services/api.service';

export type RoleDto = { id: number; name: string; description?: string | null };
export type PermissionDto = { id: number; name: string; description?: string | null };
export type RoleWithPerms = RoleDto & { permissions?: PermissionDto[] };
export type RbacUser = {
  id: number;
  login?: string | null;
  email?: string | null;
  roles?: RoleDto[];
  permissions?: PermissionDto[];
};

export const rbacApi = {
  // Users
  createUser: async (
    payload: { login: string; password: string; email?: string },
    roleName?: string,
  ): Promise<RbacUser> => {
    const qs = roleName && roleName.trim() ? `?role=${encodeURIComponent(roleName.trim())}` : '';
    const { data } = await $api.post(`/users/signup${qs}`, payload);
    return (data?.data ?? data) as RbacUser;
  },
  deleteUser: async (userId: number): Promise<void> => {
    await $api.delete(`/users/${userId}`);
  },
  // Roles
  getRoles: async (): Promise<RoleDto[]> => {
    const { data } = await $api.get('/roles');
    return data?.data ?? data ?? [];
  },
  createRole: async (payload: Omit<RoleDto, 'id'>): Promise<RoleDto> => {
    const { data } = await $api.post('/roles', payload);
    return data?.data ?? data;
  },
  updateRole: async (id: number, payload: Omit<RoleDto, 'id'>): Promise<RoleDto> => {
    const { data } = await $api.put(`/roles/${id}`, payload);
    return data?.data ?? data;
  },
  deleteRole: async (id: number): Promise<void> => {
    await $api.delete(`/roles/${id}`);
  },

  // Permissions
  getPermissions: async (): Promise<PermissionDto[]> => {
    const { data } = await $api.get('/permissions');
    return data?.data ?? data ?? [];
  },
  createPermission: async (payload: Omit<PermissionDto, 'id'>): Promise<PermissionDto> => {
    const { data } = await $api.post('/permissions', payload);
    return data?.data ?? data;
  },
  updatePermission: async (
    id: number,
    payload: Omit<PermissionDto, 'id'>,
  ): Promise<PermissionDto> => {
    const { data } = await $api.put(`/permissions/${id}`, payload);
    return data?.data ?? data;
  },
  deletePermission: async (id: number): Promise<void> => {
    await $api.delete(`/permissions/${id}`);
  },

  // Role-Permission mapping
  assignPermToRole: async (roleId: number, permId: number): Promise<void> => {
    await $api.post(`/roles/${roleId}/permissions/${permId}`);
  },
  removePermFromRole: async (roleId: number, permId: number): Promise<void> => {
    await $api.delete(`/roles/${roleId}/permissions/${permId}`);
  },

  // User-Role mapping
  assignRoleToUser: async (userId: number, roleId: number): Promise<void> => {
    await $api.post(`/users/${userId}/roles/${roleId}`);
  },
  removeRoleFromUser: async (userId: number, roleId: number): Promise<void> => {
    await $api.delete(`/users/${userId}/roles/${roleId}`);
  },

  // Aggregates
  getUsersRbac: async (): Promise<RbacUser[]> => {
    const { data } = await $api.get('/users/rbac');
    return data?.data ?? data ?? [];
  },
  getRolesDetails: async (): Promise<RoleWithPerms[]> => {
    const { data } = await $api.get('/roles/details');
    return data?.data ?? data ?? [];
  },
};

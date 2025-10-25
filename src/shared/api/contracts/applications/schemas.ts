export interface PermissionDto {
  id: number;
  name: string;
  description?: string;
}

export interface ExternalApplicationBaseEntity {
  id: string;
  name: string;
  createdAtUtc: string;
}

export interface ExternalApplicationListDto extends ExternalApplicationBaseEntity {
  permissions: PermissionDto[];
}

export interface ExternalApplicationReadDto extends ExternalApplicationBaseEntity {
  token: string;
  permissions: PermissionDto[];
}

export interface ExternalApplicationCreateDto {
  name: string;
  permissionIds: number[];
}

// examples
export enum UserRoles {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  USER = 3,
  CUSTOMER = 4,
}

export enum RolePermissions {
  // 1 + 2 + 4 + 8
  SUPER_ADMIN = 15,
  ADMIN = 12,
  USER = 7,
  CUSTOMER = 3,
}

import { UserRole } from '@sc-fam/data';

const SLUG = Symbol();

type PermissionMap = {
  [K in string | typeof SLUG]?:
    | PermissionMap
    | [UserRole, PermissionMap]
    | UserRole;
};

const permisionMap: PermissionMap = {
  polls: {
    '+': UserRole.ADMIN,
    [SLUG]: [
      UserRole.STUDENT,
      {
        info: UserRole.ADMIN,
      },
    ],
  },
  gallery: {
    upload: UserRole.ADMIN,
  },
  events: {
    '+': UserRole.ADMIN,
  },
};

export function getMinRoleForRoute(path: string): UserRole | null {
  const parts = path.slice(1).split('/');
  let parent = permisionMap;
  let lastRole: UserRole | null = null;

  for (const part of parts) {
    const entry = parent[part] ?? parent[SLUG];

    if (entry === undefined) {
      break;
    } else if (Array.isArray(entry)) {
      lastRole = entry[0];
      parent = entry[1];
    } else if (typeof entry === 'object') {
      parent = entry;
    } else {
      lastRole = entry;
      break;
    }
  }

  return lastRole;
}

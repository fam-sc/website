import { getCurrentUserRole } from '@/auth/session/next';

export default async function ProtectedPage() {
  const role = await getCurrentUserRole();
  if (role === null) {
    return <p>No Auth</p>;
  }

  return <p>Auth</p>;
}

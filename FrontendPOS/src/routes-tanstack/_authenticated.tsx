/** Protected Routes Layout (_authenticated) **/

import { createFileRoute, redirect } from '@tanstack/react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { tokenManager } from '@/features/auth';

function AuthenticatedLayout() {
  return <MainLayout />;
}

export const Route = createFileRoute('/_authenticated')({
  /*
   * beforeLoad function:
   * - Check if token exists
   * - If no token, throw redirect to login page
   * - This runs before the route loads
   */
  beforeLoad: async () => {
    const token = tokenManager.getToken();
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout,
});
